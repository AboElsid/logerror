    var blogId = '7359325443656174006'; // استبدل بمعرف مدونتك في بلوجر
    var apiKey = 'AIzaSyCEZqOzuAdjP11pOqPnC68FL-2d2GC1cps'; // استبدل بمفتاح API الخاص بك في بلوجر
    var discordWebhookUrl = 'https://discord.com/api/webhooks/1254843390470787175/-kHCYOuPShUEUGdG1AFSdJEnijPiKsP87f9RdDIAgegQ3KB6sO2RdEdVU56OEoEnJPCL'; // استبدل برابط الويب هوك في ديسكورد
    var userId = '557729993459761155'; // معرف المستخدم في ديسكورد للإشارة

    // دالة لقياس سرعة استجابة الموقع
    function measureWebsiteSpeed() {
      var startTime = new Date().getTime();
      var blogUrl = 'https://www.googleapis.com/blogger/v3/blogs/' + blogId + '/posts?key=' + apiKey;

      fetch(blogUrl)
        .then(function(response) {
          var endTime = new Date().getTime();
          var responseTime = endTime - startTime;

          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Network response was not ok.');
          }
        })
        .then(function(data) {
          if (responseTime > 3000) {
            sendToDiscord('Slow Response Detected', 'الموقع يستجيب ببطء. وقت الاستجابة: ' + responseTime + ' مللي ثانية', true);
          } else {
            sendToDiscord('Response Time Normal', 'وقت استجابة الموقع: ' + responseTime + ' مللي ثانية', false);
          }
        })
        .catch(function(error) {
          sendToDiscord('# Error', 'حدث خطأ أثناء قياس سرعة استجابة الموقع: ' + error.message, true);
        });
    }

    // دالة للتحقق من وجود صور مكسورة في المدونة ومراقبة المدونة
    function monitorBlog() {
      var blogUrl = 'https://www.googleapis.com/blogger/v3/blogs/' + blogId + '/posts?key=' + apiKey;

      fetch(blogUrl)
        .then(function(response) {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Network response was not ok.');
          }
        })
        .then(function(data) {
          var posts = data.items;
          var brokenImages = [];

          posts.forEach(function(post) {
            var content = post.content;
            var postId = post.id;
            var postTitle = post.title;

            var imgPattern = /<img[^>]+src="(http[s]?:\/\/[^"]+)"[^>]*>/g;
            var match;

            while ((match = imgPattern.exec(content)) !== null) {
              var imgSrc = match[1];
              fetch(imgSrc)
                .then(function(imgResponse) {
                  if (imgResponse.status !== 200) {
                    brokenImages.push({
                      postTitle: postTitle,
                      imgSrc: imgSrc
                    });
                  }
                })
                .catch(function(error) {
                  brokenImages.push({
                    postTitle: postTitle,
                    imgSrc: imgSrc
                  });
                });
            }
          });

          if (brokenImages.length > 0) {
            var message = 'Found broken images in the :\n';
            brokenImages.forEach(function(brokenImage) {
              message += 'Post Title: ' + brokenImage.postTitle + '\nImage Source: ' + brokenImage.imgSrc + '\n\n';
            });
            sendToDiscord('Broken Images Found', message, true);
          } else {
            sendToDiscord('All Clear', 'No broken images found in the site.', false);
          }

          // قياس سرعة استجابة الموقع بعد التحقق من الصور المكسورة
          measureWebsiteSpeed();

        })
        .catch(function(error) {
          sendToDiscord('# Error', 'حدث خطأ أثناء مراقبة المدونة: ' + error.message, true);
        });
    }

    // دالة لإرسال رسائل إلى ديسكورد
    function sendToDiscord(title, message, mention) {
      var xhr = new XMLHttpRequest();
      var payload = {
        'content': title + '\n' + message
      };

      if (mention) {
        payload.content = '<@' + userId + '> ' + payload.content;
      }

      xhr.open('POST', discordWebhookUrl, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send(JSON.stringify(payload));
    }

    // تنفيذ monitorBlog() كل 5 دقائق
    setInterval(function() {
      monitorBlog();
    }, 5 * 60 * 1000); // تنفيذ كل 5 دقائق (5 * 60 * 1000 ميلي ثانية)

    // تنفيذ monitorBlog() للمرة الأولى عند بدء التشغيل
    monitorBlog();
