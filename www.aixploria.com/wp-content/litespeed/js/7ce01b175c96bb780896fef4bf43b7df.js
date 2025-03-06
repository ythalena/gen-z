jQuery(document).ready(function($) {
    var isProcessing = !1;
    $('.like-button').click(function() {
        if (isProcessing) {
            return
        }
        var post_id = $(this).data('postid');
        var button = $(this);
        if (document.cookie.split(';').some((item) => item.trim().startsWith('liked_post_' + post_id + '=')) || sessionStorage.getItem('liked_post_' + post_id)) {
            button.addClass('liked');
            setTimeout(function() {
                button.removeClass('liked')
            }, 1000);
            return
        }
        isProcessing = !0;
        $.post(like_params.ajax_url, {
            action: 'increase_likes',
            post_id: post_id,
            nonce: like_params.nonce
        }, function(response) {
            if (response && !isNaN(response) && parseInt(response) > 0) {
                button.html('<img src="/wp-content/uploads/2024/01/arrow-vote-ranking-ai-4-green.png" class="flsing3 flsing4" style="width: 17px; height: auto;" width="17" height="auto" title="Upvote" alt="Upvote"> <span class="numbers-upvote"> ' + response + '</span>')
            } else {
                button.html('<img src="/wp-content/uploads/2024/01/arrow-vote-ranking-ai-4-green.png" class="flsing3 flsing4" width="17" height="auto" style="width: 17px; height: auto;" title="Upvote" alt="Upvote">')
            }
            var date = new Date();
            date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toUTCString();
            document.cookie = 'liked_post_' + post_id + '=true' + expires + '; path=/';
            sessionStorage.setItem('liked_post_' + post_id, 'true');
            isProcessing = !1
        })
    })
});
jQuery(document).ready(function($) {
    function hasClickedSpecialButton(post_id) {
        return document.cookie.split(';').some((item) => item.trim().startsWith('clicked_special_' + post_id + '=')) || sessionStorage.getItem('clicked_special_' + post_id)
    }

    function setClickedSpecialButton(post_id) {
        var date = new Date();
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toUTCString();
        document.cookie = 'clicked_special_' + post_id + '=true' + expires + '; path=/';
        sessionStorage.setItem('clicked_special_' + post_id, 'true')
    }
    $('#specialButton, #secondSpecialButton').click(function(event) {
        var button = $(this);
        var post_id = button.data('postid');
        if (hasClickedSpecialButton(post_id)) {
            console.log('Vous avez déjà cliqué sur ce bouton.');
            return
        }
        $.post(like_params.ajax_url, {
            action: 'increase_special_counter',
            post_id: post_id,
            nonce: like_params.nonce
        }, function(response) {
            if (response && !isNaN(response)) {
                $('#specialCounterDisplay').text(response);
                setClickedSpecialButton(post_id)
            }
        })
    })
});