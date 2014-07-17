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
            alert("Thank you! We will send you an email a few days before the app is ready to download.");
        }
    ).fail(function(res){
            if (res.responseJSON.error.invalidAttributes.email[0].rule == "email") {
                alert("You left the input empty, or typed an invalid email");
            }
            if (res.responseJSON.error.invalidAttributes.email[0].rule == "unique") {
                alert("That email already exists");
            }
            console.log(res);
    });
});