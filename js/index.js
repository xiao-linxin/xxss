/**
 * Created by gthowe on 17/2/24.
 */
$(document).ready(function(){

    function getUrlParam(name) {
        //构造一个含有目标参数的正则表达式对象
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        //匹配目标参数
        var r = window.location.search.substr(1).match(reg);
        //返回参数值
        if (r != null) return unescape(r[2]);
        return null;
    }
    var NO = getUrlParam("NO");//接收的参数
    var result = [];//关键字组 form1总经理,form2技术大神 ,form3销售
    var saveData = [];
    var results = {
        r1:["性格:","外向","内向"],
        r2:["性别:","男","女"],
        r3:["做事:","结果导向","注重过程"],
        r4:["社交状况:","爱社交","宅神"],
        r5:["生活态度:","消费型","存储型"]
    };
    var model = [
        {q:0},
        {q:0},
        {q:0},
        {q:0},
        {q:0}
    ];
    //结果
    function getResult(){
        result = [];
        if(model[0].q == 1){//销售
            result.push("result0")
        }
        if(model[2].q == 1){//经理
            result.push("result1")
        }
        if(model[3].q == 2){//IT男
            result.push("result2")
        }
        if(result.length == 0){
            result.push("result0");
            result.push("result1");
            result.push("result2");
        }
        return result;
        // localStorage.setItem("saveData",saveData.join(";"));
        // location.href= result[Math.round(Math.random() * (result.length-1))]+ '?NO='+getUrlParam('NO');
    }

    //事件响应
    new clickEvent('q1_l','q1_r',0);
    new clickEvent('q2_l','q2_r',1);
    new clickEvent('q3_l','q3_r',2);
    new clickEvent('q4_l','q4_r',3);
    new clickEvent('q5_l','q5_r',4);

    function clickEvent(id1,id2,index){
        $('#'+id1).click(function(){//left
            $('#'+id1).css('background','url("./img/aio_btn_sel_0.png") no-repeat');
            $('#'+id1).css('background-size','100% auto');
            $('#'+id2).css('background','url("./img/aio_btn_0.png") no-repeat');
            $('#'+id2).css('background-size','100% auto');
            model[index].q = 1;
            showSlideDown(index);
            saveData[index] = results['r'+(index+1)][0] + results['r'+(index+1)][1];
        });
        $('#'+id2).click(function(){//right
            $('#'+id2).css('background','url("./img/aio_btn_sel_0.png") no-repeat');
            $('#'+id2).css('background-size','100% auto');
            $('#'+id1).css('background','url("./img/aio_btn_0.png") no-repeat');
            $('#'+id1).css('background-size','100% auto');
            model[index].q = 2;
            showSlideDown(index);
            saveData[index] = results['r'+(index+1)][0] + results['r'+(index+1)][2];
        })
    }

    //页面滑动出现事件
    var isShowResult = false;
    function showSlideDown(index){
        if(isShowResult){
            $('#question_result').attr("src","./img/"+getResult()[Math.round(Math.random() * (result.length-1))]+".png");
            return
        }
        if(index == 4){
            $('#question_result').attr("src","./img/"+getResult()[Math.round(Math.random() * (result.length-1))]+".png");
            $('#result_contain').slideDown();
            $('#form').slideDown();
            $('html, body').animate({scrollTop: 500}, 500);
            isShowResult = true
        }else {
            $('#q'+index).slideDown();
        }
    }

    var allow = true;
    $('.form_allow').click(function(){
        if(allow){
            $('#unselected').show();
            $('#selected').hide();
            showToastTips("请同意授权参加活动");
        }else {
            $('#unselected').hide();
            $('#selected').show();
        }
        allow = !allow
    });

    $('.modal_btn').click(function () {
        $('.modal').hide();
    });


    //名称验证
    function name_check(name) {
        if (name == "" || name == undefined || name == null) {
            return false
        } else {
            //验证逻辑
            var patt1 = new RegExp("^[\u4e00-\u9fa5]{2,}$");//验证只能中文输入
            if (!patt1.test(name)) {
                return false;
            } else {
                return true;
            }
        }
    }

    //手机校验
    function moblie_check(moblie) {
        if (moblie == "" || moblie == undefined || moblie == null) {
            return false
        } else {
            //验证逻辑
            var patt1 = new RegExp("^[1][3,4,5,7,8][0-9]{9}$");//验证长度，第一位数必须是1
            if (!patt1.test(moblie)) {
                return false;
            } else {
                return true;
            }
        }
    }

    function province_check(value){
        /*省份的获取值判断*/
        if(value =="请选择" || value =="")
        {
            return false;
        }else {
            return true;
        }
    }

    //校验
    function check_all(data) {
        if(!name_check(data.name)){
            showToastTips("请输入正确的姓名");
            return false
        }
        if(!moblie_check(data.mobile)){
            showToastTips("请输入正确的手机号");
            return false
        }
        if(!province_check(data.address)){
            showToastTips("请选择你的省份");
            return false
        }
        if(!allow){
            showToastTips("请同意授权参加活动");
            return false
        }
        return true;
    }
    //提交
    $(".submit_btn").click(function () {
        var model ={
            name:$('#name').val(),
            mobile:$('#mobile').val(),
            address:$('#address').val()
        };

        if(check_all(model)){
            remark = saveData.join("|");
            //判断是否勾选接受保险服务
            if($("#selected").css("display") == 'inline'){
                remark += "|是否接受后续保险服务：是";
            }else{
                remark += "|是否接受后续保险服务：否";
            }
            $("#province").val($("#address").val());
            $("#remark").val(remark);
            if($("#address").val()!="其它"){
                $("#myform").submit();
                $('.loading').show();
            }else{
                $('.loading').show();
                $("#name").val("");
                $("#mobile").val("");
                $('.loading').hide();
                $('.modal').show();
            }

            // $('.loading').show();
            //ajax
            // $('.loading').hide();

            // $('.modal').show();
        }
        // location.href="http://m.cignacmb.com/campaign/mc/his/dd5/?chl=his-sms";
    });

    /*******Tosat提示********/
    var err_mLeft = (document.body.offsetWidth - 200) / 2;
    $('#tips').css('left', err_mLeft);
    function showToastTips(content) {
        $('#tips').css('display', 'block');
        $('#tips_content').text(content);
        setTimeout(function () {
            $('#tips').css('display', 'none');
        }, 1500)
    }

    $('#address').css('height',document.body.clientWidth / 12.5 + 'px');
});