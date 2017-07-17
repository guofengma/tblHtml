(function(){
    $(function(){
        $.ajax({
        url: getPort() + 'employee/getEmployeeInfo',
        data:{'openId':getCookie('openid')},
        dataType: 'json',
        type: 'POST',
        success: function (data) {
          console.log(data);
          if (data.statusCode == 1) {
            //获取数据成功；获取显示二维码
            /**
             * 图片暂时无法显示
             */
            $('#getCode').attr('src','http://www.tdaifu.cn:8090/taodoctor' + data.obj.qrcode)
          } else if (data.statusCode == 0) {
            //获取数据失败；
            layer.open({
              content: data.message
              , skin: 'msg'
              , time: 2 //2秒后自动关闭
            });
          }
        }
      });
    });
})();