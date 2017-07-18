(function () {
    $(function () {
        //设置页面高度
        $('body').height($('body')[0].clientHeight);
        $('#addDoc').hide();
        var timeStart = '';//全局开始时间
        var timeEnd = '';//全局结束时间
        var timeStartNum = 0;//判断开始时间是否大于结束时间
        var timeEndNum = +new Date();
        //获取当前时间
        timeEnd = formatDate(+new Date());
        var tmpTime = timeEnd.replace(/(\d+)-(\d+)-(\d+)/g, function (s, s1, s2, s3) {
            return s1 + '年' + s2 + '月' + s3 + '日';
        });
        $('.end_date_show').text(tmpTime);
        //日期选择弹出框（开始）;
        var calendarStart = new datePicker();
        calendarStart.init({
            'trigger': '#dateStart', /*按钮选择器，用于触发弹出插件*/
            'type': 'date',/*模式：date日期；datetime日期时间；time时间；ym年月；*/
            'minDate': '2000-1-1',/*最小日期*/
            'maxDate': '2030-12-31',/*最大日期*/
            'onSubmit': function () {/*确认时触发事件*/
                //得到选择的时间段，格式2017-09-10；
                timeStart = calendarStart.value;
                timeStartNum = +new Date(timeStart);
                console.log(timeStartNum);
                var startTimeStr = timeStart.replace(/(\d+)-(\d+)-(\d+)/g, function (s, s1, s2, s3) {
                    return s1 + '年' + s2 + '月' + s3 + '日';
                });
                $('.start_date_show').text(startTimeStr);
            }
        });
        //日期弹出框（结束）
        var calendarEnd = new datePicker();
        calendarEnd.init({
            'trigger': '#dateEnd', /*按钮选择器，用于触发弹出插件*/
            'type': 'date',/*模式：date日期；datetime日期时间；time时间；ym年月；*/
            'minDate': '2000-1-1',/*最小日期*/
            'maxDate': '2030-12-31',/*最大日期*/
            'onSubmit': function () {/*确认时触发事件*/
                //得到选择的时间段，格式2017-09-10；
                timeEnd = calendarEnd.value;
                timeEndNum = +new Date(timeEnd);
                console.log(timeEndNum);
                var endTime = timeEnd.replace(/(\d+)-(\d+)-(\d+)/g, function (s, s1, s2, s3) {
                    return s1 + '年' + s2 + '月' + s3 + '日';
                });
                $('.end_date_show').text(endTime);
            }
        });
        //点击已入账和未入账按钮，显示相应信息
        $('.no_pass').show();
        $('.passed').hide();
        $('#hadMoney').on('click', function () {
            $(this).addClass('active');
            $('#noMoney').removeClass('active');
            $('.no_pass').show();
            $('.passed').hide();
        });
        $('#noMoney').on('click', function () {
            $(this).addClass('active');
            $('#hadMoney').removeClass('active');
            $('.passed').show();
            $('.no_pass').hide();
            trigger();
        });
        //默认开始时间
        getStartTime();
        //点击查询按钮
        $('#queryBtn').on('click', function () {
            //下拉加载
            //页数
            $('#noListDoc > .list_show').empty();
            $('#hadListDoc > .passed_list_show').empty();
            if (timeStartNum > timeEndNum) {
                layer.open({
                    content: '开始时间不能大于结束时间'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
            } else {
                trigger();
            }
        });
        //点击已通过医生
        $('.passed_list_show').on('click', 'li', function () {
            console.log($(this).attr('docid'));
            setCookie('docid', $(this).attr('docid'));
            window.location.href = './docSelfInfo.html';
        });
        //时间戳格式化
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
                return [year, month, day].join('-');
            }
            else {
                return null;
            }
        }
        //取得合伙人的创建时间
        function getStartTime() {
            $.ajax({
                url: getPort() + 'doctor/getDefaultTime',
                data: {
                    'employeeId': getCookie('id')
                },
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.statusCode == 1) {
                        //获取数据成功；
                        timeStart = formatDate(+data.str);
                        var timeStartChese = timeStart.replace(/(\d+)-(\d+)-(\d+)/g, function (s, s1, s2, s3) {
                            return s1 + '年' + s2 + '月' + s3 + '日';
                        });
                        $('.start_date_show').text(timeStartChese);
                        timeStartNum = +data.str;
                        trigger();
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
        }
        //触发事件
        function trigger() {
            $('#addDoc').hide();
            //默认触发
            //下拉加载
            //页数
            $('.dropload-down').remove();
            if ($('#hadMoney').hasClass('active')) {
                var pageNo = 0;
                //每页展示10个
                var sizeNo = 10;
                //dropload
                $('#noListDoc').dropload({
                    scrollArea: window,
                    loadDownFn: function (me) {
                        pageNo++;
                        // 拼接HTML
                        var result = '';
                        $.ajax({
                            type: 'POST',
                            url: getPort() + 'doctor/getDoctorListByTime',
                            data: {
                                currentPage: pageNo,
                                pageSize: sizeNo,
                                employeeId: getCookie('id'),
                                startTime: timeStart,
                                endTime: timeEnd
                            },
                            dataType: 'json',
                            success: function (res) {
                                console.log(res);
                                $('.no_pass_num').text(res.data.notEnableCount);
                                if(res.map.notEnableDoctor.length == 0 && res.map.enableDoctor.length == 0){
                                    $('#addDoc').show();
                                }
                                if (res.map.notEnableDoctor.length > 0) {
                                    var headerImg = '';
                                    res.map.notEnableDoctor.forEach(function (v, i) {
                                        if (v.header == '') {
                                            headerImg = './imgs/icon.jpg';
                                        } else {
                                            headerImg = v.header;
                                        }
                                        result += '<li>'
                                            + '<img src="' + headerImg + '" alt="">'
                                            + '<div class="list_box">'
                                            + '<p>' + v.name + '</p>'
                                            + '<p class="clearfix"><span>未完善资料</span>&nbsp;&nbsp;<i>90天内未完善注册将自动释放</i></p>'
                                            + '</div>'
                                            + '</li>';
                                    });
                                    //如果没有数据
                                } else {
                                    // 锁定
                                    me.lock();
                                    // 无数据
                                    me.noData();
                                }
                                //插入数据到页面，放到最后面
                                $('#noListDoc > .list_show').append(result);
                                //每次数据插入，必须重置
                                me.resetload();
                            },
                            error: function (xhr, type) {
                                alert('请求失败，请稍后重试!');
                                // 即使加载出错，也得重置
                                me.resetload();
                            }
                        });
                    }
                });
            } else if ($('#noMoney').hasClass('active')) {
                var pageHad = 0;
                //每页展示10个
                var sizeHad = 10;
                //dropload
                $('#hadListDoc').dropload({
                    scrollArea: window,
                    loadDownFn: function (me) {
                        pageHad++;
                        // 拼接HTML
                        var result = '';
                        $.ajax({
                            type: 'POST',
                            url: getPort() + 'doctor/getDoctorListByTime',
                            data: {
                                currentPage: pageHad,
                                pageSize: sizeHad,
                                employeeId: getCookie('id'),
                                startTime: timeStart,
                                endTime: timeEnd
                            },
                            dataType: 'json',
                            success: function (res) {
                                console.log(res);
                                $('.passed_num').text(res.data.enableCount);
                                if (res.map.enableDoctor.length > 0) {
                                    var headerImgYou = '';
                                    var allDataHad = '';
                                    res.map.enableDoctor.forEach(function (v, i) {
                                        if (v.header == '') {
                                            headerImgYou = './imgs/icon.jpg';
                                        } else {
                                            headerImgYou = v.header;
                                        }
                                        if (v.fourCard == 1) {
                                            allDataHad = '<i>已完善五证</i>';
                                        } else if (v.fourCard == 0) {
                                            allDataHad = '<i class="no_five">未完善五证</i>'
                                        }
                                        result += '<li docId="' + v.id + '">'
                                            + '<img src="' + headerImgYou + '" alt="">'
                                            + '<div class="list_box">'
                                            + '<p><span>' + v.name + '</span>' + allDataHad + '</p>'
                                            + '<p class="clearfix"><span>' + v.hospitalName + '</span><i>' + v.department + '</i></p>'
                                            + '</div>'
                                            + '</li>';
                                    });
                                    //如果没有数据
                                } else {
                                    // 锁定
                                    me.lock();
                                    // 无数据
                                    me.noData();
                                }
                                //插入数据到页面，放到最后面
                                $('#hadListDoc > .passed_list_show').append(result);
                                //每次数据插入，必须重置
                                me.resetload();
                            },
                            error: function (xhr, type) {
                                alert('请求失败，请稍后重试!');
                                // 即使加载出错，也得重置
                                me.resetload();
                            }
                        });
                    }
                });
            }
        }

    });
})();