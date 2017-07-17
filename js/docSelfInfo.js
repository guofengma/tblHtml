(function () {
    $(function () {
        $.ajax({
            url: getPort() + 'doctor/ getDoctorDetailById',
            dataType: 'json',
            data: {
                doctorId: getCookie('docid'),
                employeeId: getCookie('id')
            },
            type: 'POST',
            success: function (data) {
                console.log(data);
                if (data.statusCode == 1) {
                    //获取数据成功；
                    var docInfo = data.obj.doctorDetail;
                    var jihuoTrue = '';
                    var headImg = '';
                    var renzhengTrue = '';
                    var wuzhengTrue = '';
                    var zhenliaoTrue = '';
                    var zhenliaoOpenTrue = '';
                    if(docInfo.header == '') {
                        headImg = './imgs/information_logo.png';
                    }else {
                        headImg = docInfo.header;
                    }
                    if (data.obj.activate == 1) {
                        jihuoTrue = '<p>成功激活</p>';
                        renzhengTrue = '<span class="registed">已认证</span>';

                    } else if (data.obj.activate == 0) {
                        jihuoTrue = '<p>未激活激活</p>';
                        renzhengTrue = '<span class="upload_line">未认证</span>';
                    }
                    if(data.obj.fourCard == 1) {
                        wuzhengTrue = '<span class="registed">已上传</span>';
                    }else {
                        wuzhengTrue = '<span class="upload_line">未上传</span>'
                    }
                    if(data.obj.tzztransferstat == 1) {
                        zhenliaoTrue = '<span class="registed">已开启</span>';
                    }else {
                        zhenliaoTrue = '<span class="upload_line">未开启</span>';
                    }
                    var headStr = '<p><span>' + docInfo.name + '</span>医生 &nbsp;|&nbsp; <i>' + docInfo.department + '</i></p>' + jihuoTrue;
                    $('.doc_top').html(headStr);
                    var creatStr = '<p>邀请时间：'+formatDate(data.obj.createTime)+'</p>'
                        + '<div class="doc_logo clearfix">'
                        + '<img src="'+headImg+'" alt="">'
                        + '<span>'+docInfo.name+' &nbsp '+docInfo.department+'</span>'
                        + '<span>'+docInfo.hospitalName+'</span>'
                        + '<a href="./docSelfInfoDetail.html" id="selfMore">'
                        + '<i class="iconfont icon-right"></i>'
                        + '</a>'
                        + '</div>'
                    $('.doc_one').html(creatStr);
                    //医生状态部分
                    /**
                     * 获取医生信息判断激活类型
                     */
                     var docSelfStr = '<p>医生状态</p>'
                                    +'<ul>'
                                    +'<li>'
                                    +'<p>通过认证'+renzhengTrue+'</p>'
                                    +'</li>'
                                    +'<li>'
                                    +'<p>上传五证获得在线处方权'+ wuzhengTrue +'</p>'
                                    +'</li>'
                                    +'</ul>';
                    $('.doc_two').html(docSelfStr);
                    var  docOpenStr = '<li class="clearfix">'
                                        +'<p>健康咨询<span class="registed">已开启</span></p>'
                                        +'<p>'+data.obj.getvisopenphonetime+'个时段&nbsp;&nbsp;'+data.obj.getvisopenphonetimeCount+'个小时<a href="./docOpenInfo.html" id="showDetail">查看详情</a></p>'
                                        +'</li>'
                                        +'<li>'
                                        +'<p>预约诊疗'+zhenliaoTrue+'</p>'
                                        +'<p>尚未开放时间，请协助医生开放服务时间</p>'//判断是否开启预约诊疗
                                        +'</li>';
                    $('.doc_open_three').html(docOpenStr);
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
        //格式时间戳
        function formatDate(date) {
            if (date != null && date != "") {
                var d = new Date(date)
                    , month = '' + (d.getMonth() + 1)
                    , day = '' + d.getDate()
                    , year = '' + d.getFullYear()
                    , hour = '' + d.getHours()
                    , minute = '' + d.getMinutes()
                    , second = '' + d.getSeconds();
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
                if (hour.length < 2) hour = '0' + hour;
                if (minute.length < 2) minute = '0' + minute;
                if (second.length < 2) second = '0' + second;
                return [year, month, day].join('-') + '&nbsp;' + [hour, minute, second].join(':');
            }
            else {
                return null;
            }
       }
    });
})();