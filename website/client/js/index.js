$(function () {
    goup();
    toPage();
});
function goup() {
    var dr = ($(window).width() - $(".container").width()) / 2 - 60;
    dr = dr <= 0 ? 0 : dr;
    var $d = $("<div/>").attr('title', '返回顶部').addClass('goup').click(function (event) {
        $('html,body').animate({ scrollTop: "0" }, 500);
    });
    $("body").append($d);
    $(window).scroll(function (event) {
        if ($d.offset().top <= $(window).height()) {
            $d.removeClass('active').removeAttr('style');
        } else {
            $d.addClass('active').css('right', dr);
        }
    }).resize(function (event) {
        dr = ($(window).width() - $(".container").width()) / 2 - 60;
        dr = dr <= 0 ? 0 : dr;
        $d.css('right', dr);
    });
}

function toPage() {
    $("a[href^='#']").click(function (event) {
        var id = $(this).attr("href").substring(1);
        var top = 0;
        if (id) {
            top = $("section[id=" + id + "]").offset().top;
        }
        $('html,body').animate({ scrollTop: top }, 500);
    })
}