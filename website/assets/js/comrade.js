/**
 * Created by aaronrussell on 6/28/14.
 */
$('#submitBeta').click(function() {
    console.log('logging');
    var betaEmail = $("#betaEmail").val();

    console.log(betaEmail);
    $.post(
        '/BetaEmails',
        {email: betaEmail},
        function () {
            alert("Thank you!");
        }
    ).fail(function(res){
        if (res.getResponseHeader("error") == null) {
            alert("You forgot to insert something, or invalid email");
        }
    });
});