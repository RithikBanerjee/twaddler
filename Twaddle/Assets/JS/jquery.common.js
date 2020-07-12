$(window).load(function () {
    $("#Register").show();
    $("#TwaddleWorld").hide();

    let hub = $.connection.masterHub;
    hub.client.LogIn = function (twaddler, twaddlers, twaddles) {
        $("#Register").hide();
        $("#TwaddleWorld").show();
        $('#Twaddler').html(twaddler.Name);
        connectionId = twaddler.ConnectionId;
        $.each(twaddlers, function (i, value) {
            $("#Twaddlers").AddTwaddler(hub, value)
        })
        $.each(twaddles, function (i, value) {
            $('#Twaddles').AddTwaddle(value)
        })
    }
    hub.client.BroadcastTwaddle = function (twaddle) {
        $('#Twaddles').AddTwaddle(twaddle);
    }
    hub.client.TwaddlerLogIn = function (twaddler) {
        $("#Twaddlers").AddTwaddler(hub, twaddler);
    }
    hub.client.BoradcastTwaddlerLogOut = function (twaddler) {
        $(`#private_${twaddler.ConnectionId}`).remove();
        $(`#twaddler_${twaddler.ConnectionId}`).remove();
        var disc = $('<div class="disconnect">"' + twaddler.Name + '" logged off.</div>');
        $(disc).hide();
        $('#Twaddlers').prepend(disc);
        $(disc).fadeIn(200).delay(2000).fadeOut(200);
    }
    hub.client.PrivateTwaddle = function (senderId, twaddle) {
        if ($(`#private_${senderId}`).length == 0) {
            $.fn.StartPrivateTwaddle(hub, { Name: twaddle.Twaddler, ConnectionId: senderId });
        }
        $(`#private_${senderId}`).find('#divMessage').append('<div class="message"><span class="userName">' + twaddle.Twaddler + '</span>: ' + twaddle.TwaddleContent + '</div>');
        var privateTwaddle = $(`#private_${senderId}`).find('#divMessage');
        $(privateTwaddle).find('#divMessage').scrollTop(privateTwaddle.scrollHeight);
    }
    $.connection.hub.start().done(function () {
        $.fn.TwaddlerLogIn(hub);
    });
});

$.fn.TwaddlerLogIn = function (hub) {
    var twaddlerName;
    $('#LogIn').click(function () {
        twaddlerName = $('#TwaddlerName').val();
        if (twaddlerName.length > 0)
            hub.server.onConnected(twaddlerName);
        else
            alert("Please Enter your Name to LogIn");
    });
    $('#TwaddlerName').keypress(function (e) {
        if (e.which == 13)
            $("#LogIn").click();
    });
    $('#Broadcast').click(function () {
        var twaddle = $("#Twaddle").val();
        if (twaddle.length > 0) {
            hub.server.broadcastTwaddle({ Twaddler: twaddlerName, TwaddleContent: twaddle });
            $("#Twaddle").val('');
        }
    });
    $('#Twaddle').keypress(function (e) {
        if (e.which == 13)
            $('#Broadcast').click();
    });
}

$.fn.AddTwaddle = function (twaddle) {
    $(this).append(`<div class="message"><span class="userName">'${twaddle.Twaddler}</span>: '${twaddle.TwaddleContent}'</div>`);
    $(this).scrollTop(this.scrollHeight);
}
var connectionId;
$.fn.AddTwaddler = function (hub, twaddler) {
    if (connectionId == twaddler.ConnectionId)
        $(this).append(`<div class="loginUser">${twaddler.Name}</div>`);
    else {
        $(this).append(`<a id="twaddler_${twaddler.ConnectionId}" class="user" >${twaddler.Name}<a>`);
        $(`#twaddler_${twaddler.ConnectionId}`).dblclick(function () {
            if ($(`#private_${twaddler.ConnectionId}`).length != 0)
                return;
            $.fn.StartPrivateTwaddle(hub, twaddler);
        });
    }
    $(this).scrollTop(this.scrollHeight);
}

$.fn.StartPrivateTwaddle = function (hub, twaddler) {
    var $div = $(`<div id="private_${twaddler.ConnectionId}" class="ui-widget-content draggable" rel="0">` +
        '<div class="header">' +
        '<div  style="float:right;"><a id="close">x</a>&nbsp;&nbsp;</div>' +
        `<span class="selText" rel="0">Twaddler: ${twaddler.Name}</span></div>` +
        '<div id="divMessage" class="messageArea"></div>' +
        '<div class="buttonBar">' +
        '<input id="PrivateTwaddle" class="msgText" type="text"/>' +
        '<input id="PrivateBroadcast" class="submitButton button" type="button" value="Twaddle"/>' +
        '</div></div>');
    $div.find('#close').click(function () {
        $(`#private_${twaddler.ConnectionId}`).remove();
    });
    $div.find("#PrivateBroadcast").click(function () {
        var twaddleContent = $div.find("#PrivateTwaddle").val();
        if (twaddleContent.length > 0) {
            hub.server.privateTwaddle(twaddler.ConnectionId, twaddleContent);
            $div.find("#PrivateTwaddle").val('');
        }
    });
    $div.find("#PrivateTwaddle").keypress(function (e) {
        if (e.which == 13)
            $div.find("#PrivateBroadcast").click();
    });
    $('#Zone').prepend($div);
    $div.draggable({ handle: ".header" });
}
