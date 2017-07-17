(function () {
  $(function () {
    //判断显示元素默认隐藏
    $('.had_card_id').hide();
    $('#bindCard').hide();
    $('.had_bank_id').hide();
    $('#bindBankCard').hide();
    $.ajax({
      url: getPort() + 'employee/getEmployeeInfo',
      data: { 'openId': getCookie('openid') },
      dataType: 'json',
      type: 'POST',
      success: function (data) {
        console.log(data);
        if (data.statusCode == 1) {
          //获取数据成功；
          var userInfo = data.obj;
          $('.user_name').text(userInfo.realName);
          $('.uese_tel').text(userInfo.mobilephone);
          userInfo.headerImage ? $('#headImg').attr('src','http://www.tdaifu.cn:8090/taodoctor/'+userInfo.headerImage) : $('#headImg').attr('src','./imgs/information_logo.png');
          //判断用户是否已绑定身份证信息
          if (!userInfo.cardId) {//用户身份证不存在
            $('#bindCard').show();
            $('.had_card_id').hide();
          } else {
            var cardNum = userInfo.cardId;
            var hadCard = cardNum.replace(/^(.{4})(?:\d+)(.{4})$/, "$1************$2");
            $('.had_card_id').show();
            $('.tel_num').text(hadCard);
            $('#bindCard').hide();
          }
          if(!userInfo.department) {
            $('.go_register').text('去认证');
          }else {
            $('.go_register').text('已认证');
            setCookie('department',data.obj.department);
            setCookie('realName',data.obj.realName);
          }
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
    //点击手机号跳转修改手机号页面
    $('.uese_tel').on('click',function(){
      window.location.href = './reviseTel.html'
    });
    getMyList();
    //请求银行卡列表
    function getMyList() {
      $.ajax({
        url: getPort() + 'employee/getBankCards',
        data: {
          'employeeId': getCookie('id')
        },
        dataType: 'json',
        type: 'POST',
        success: function (res) {
          console.log(res);
          if (res.statusCode == 1) {
            //获取数据成功；已绑定银行卡
            var bankNum = res.list[0].cardNumber;
            console.log(bankNum);
            var hadBankCard = bankNum.replace(/^(.{4})(?:\d+)(.{4})$/, "$1************$2");
            $('.had_bank_id').show();
            $('.bank_num').text(hadBankCard);
            $('#bindBankCard').hide();
          } else if (res.statusCode == 0) {
            //获取数据失败；还未绑定银行卡
            $('#bindBankCard').show();
            $('.had_bank_id').hide();
          }
        }
      });
    }
  });
})();