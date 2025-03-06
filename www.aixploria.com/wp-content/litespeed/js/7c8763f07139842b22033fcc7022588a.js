function toggleFavorite(articleId, button) {
    let favorites = getFavorites();
    articleId = parseInt(articleId);
    const index = favorites.indexOf(articleId);
    const img = button.querySelector('img');
    if (index > -1) {
        favorites.splice(index, 1);
        img.src = '/wp-content/uploads/2024/01/add-fav-ai.webp';
        img.style.filter = ''
    } else {
        if (favorites.length >= 100) {
            alert("You have reached the limit of 100 favorites.");
            return
        }
        favorites.push(articleId);
        img.src = '/wp-content/uploads/2024/01/remove-fav-ai.webp';
        img.style.filter = 'invert(1) hue-rotate(332deg)'
    }
    setFavorites(favorites)
}

function getFavorites() {
    const favorites = getCookie('favorites');
    return favorites ? JSON.parse(favorites) : []
}

function setFavorites(favorites) {
    setCookie('favorites', JSON.stringify(favorites))
}

function setCookie(name, value) {
    var date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + "; " + expires + "; path=/"
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
}

function applyCustomButtonStyle() {
    const buttons = document.querySelectorAll('.site-review2');
    buttons.forEach(button => {
        button.style.right = '15px'
    });
    const stopWordyElements = document.querySelectorAll('.stop-wordy');
    stopWordyElements.forEach(element => {
        element.style.maxWidth = '70%'
    })
}
let timeoutHideShareLinks;

function shareFavorites() {
    document.querySelector('.left-sharebtn-social').style.display = 'inline-flex';
    clearTimeout(timeoutHideShareLinks);
    var favorites = getFavorites();
    fetch(ajax_object.ajax_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'action=share_favorites&favorites=' + JSON.stringify(favorites) + '&security=' + ajax_object.nonce
    }).then(response => response.json()).then(data => {
        if (data.success) {
            var sharingLinkElement = document.getElementById('sharingLink');
            var sharingLinkAnchor = document.getElementById('sharingLinkAnchor');
            var sharingUrl = data.data.shareUrl;
            sharingLinkAnchor.href = sharingUrl;
            sharingLinkAnchor.textContent = sharingUrl;
            sharingLinkElement.style.display = 'block';
            document.getElementById('twitter-share').href = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(sharingUrl);
            document.getElementById('facebook-share').href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(sharingUrl);
            document.getElementById('linkedin-share').href = "https://www.linkedin.com/shareArticle?url=" + encodeURIComponent(sharingUrl);
            document.getElementById('telegram-share').href = "https://t.me/share/url?url=" + encodeURIComponent(sharingUrl);
            document.getElementById('email-share').href = "mailto:?body=" + encodeURIComponent(sharingUrl);
            document.querySelector('.social-share-article-pc').style.display = 'block';
            timeoutHideShareLinks = setTimeout(function() {
                document.querySelector('.left-sharebtn-social').style.display = 'none'
            }, 60000)
        } else {
            console.error('Error sharing favorites.')
        }
    }).catch(error => console.error('AJAX error :', error))
}

function removeFavoriteFromCookie(articleId) {
    const isSharedList = new URLSearchParams(window.location.search).has('list');
    if (isSharedList) {
        console.log("Unauthorized modification of a shared list");
        return
    }
    articleId = parseInt(articleId);
    let favorites = getFavorites();
    const index = favorites.indexOf(articleId);
    if (index > -1) {
        favorites.splice(index, 1);
        setFavorites(favorites);
        let articleListItem = document.querySelector('li[data-article-id="' + articleId + '"]');
        if (articleListItem) {
            let linkList = articleListItem.closest('.link-list');
            articleListItem.remove();
            if (linkList) {
                let olElement = linkList.querySelector('.yol-pad');
                if (olElement && olElement.children.length === 0) {
                    let gridItem = linkList.closest('.grid-item');
                    if (gridItem) {
                        gridItem.remove()
                    }
                }
            }
        }
    } else {
        console.error("Article not found in favorites")
    }
}

function refreshFavoritesDisplay() {
    const favorites = getFavorites()
}

function resetFavorites() {
    setFavorites([]);
    document.querySelectorAll('.grid-list .grid-item').forEach(item => item.remove())
}
document.addEventListener('DOMContentLoaded', function() {
    var copyLinkBtn = document.getElementById('copyLinkBtn');
    var sharingLinkAnchor = document.getElementById('sharingLinkAnchor');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function copySharingLink() {
            if (sharingLinkAnchor.href) {
                navigator.clipboard.writeText(sharingLinkAnchor.href).then(() => {
                    copyLinkBtn.innerHTML = '✔️ Link copied!!';
                    setTimeout(() => {
                        copyLinkBtn.innerHTML = '<img class="copy-favlist-img2" src="/wp-content/uploads/2023/03/copy-link-icon-social.webp" width="20" height="22">Copy link'
                    }, 2000)
                }).catch(err => {
                    console.error('Error while copying:', error)
                })
            }
        })
    }
    var resetFavoritesBtn = document.getElementById('resetFavoritesBtn');
    var confirmationBox = document.getElementById('confirmationBox');
    var overlay = document.getElementById('overlay');
    var confirmReset = document.getElementById('confirmReset');
    var cancelReset = document.getElementById('cancelReset');
    if (resetFavoritesBtn) {
        resetFavoritesBtn.addEventListener('click', function() {
            confirmationBox.style.display = 'block';
            overlay.style.display = 'block'
        });
        confirmReset.addEventListener('click', function() {
            resetFavorites();
            confirmationBox.style.display = 'none';
            overlay.style.display = 'none'
        });
        cancelReset.addEventListener('click', function() {
            confirmationBox.style.display = 'none';
            overlay.style.display = 'none'
        })
    }
    const urlParams = new URLSearchParams(window.location.search);
    const isSharedListPage = urlParams.has('list');
    if (isSharedListPage) {
        applyCustomButtonStyle()
    }
    const refreshButton = document.getElementById('refreshFavoritesBtn');
    const shareFavoritesBtn = document.getElementById('shareFavoritesBtn');
    if (refreshButton) {
        refreshButton.addEventListener('click', refreshFavoritesDisplay)
    }
    if (shareFavoritesBtn) {
        shareFavoritesBtn.addEventListener('click', shareFavorites)
    }
    var favoriteButtons = document.querySelectorAll('button[data-article-id]');
    favoriteButtons.forEach(function(button) {
        var articleId = parseInt(button.getAttribute('data-article-id'));
        var img = button.querySelector('img');
        if (getFavorites().indexOf(articleId) > -1) {
            img.src = '/wp-content/uploads/2024/01/remove-fav-ai.webp';
            img.style.filter = 'invert(1) hue-rotate(332deg)'
        } else {
            img.src = '/wp-content/uploads/2024/01/add-fav-ai.webp';
            img.style.filter = ''
        }
    })
});

function fetchFavoritePostsAndUpdateUI() {
    var favorites = getFavorites();
    if (favorites.length === 0) {
        console.log("Aucun favori à rafraîchir");
        return
    }
    fetch(ajax_object.ajax_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=fetch_favorites&article_ids=' + encodeURIComponent(JSON.stringify(favorites)) + '&nonce=' + ajax_object.fetch_nonce
    }).then(response => response.json()).then(data => {
        if (data.success) {
            updateFavoritesList(data.data)
        } else {
            console.error('Error updating favorites:', data.data)
        }
    }).catch(error => console.error('Error AJAX :', error))
}

function updateFavoritesList(posts) {
    let favoritesContainer = document.querySelector('.grid-list');
    favoritesContainer.innerHTML = '';
    let articlesByCategory = posts.reduce((acc, post) => {
        (acc[post.category_name] = acc[post.category_name] || []).push(post);
        return acc
    }, {});
    Object.keys(articlesByCategory).forEach(categoryName => {
        let gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        let blogList = document.createElement('div');
        blogList.className = 'blog-list';
        let categoryLink = document.createElement('a');
        categoryLink.href = encodeURI(articlesByCategory[categoryName][0].category_permalink);
        categoryLink.target = '_blank';
        categoryLink.style.textDecoration = 'none';
        let titleList = document.createElement('span');
        titleList.className = 'title-list';
        let siteIcon = document.createElement('span');
        siteIcon.className = 'site-icon2';
        siteIcon.style.backgroundImage = `url(${encodeURI(articlesByCategory[categoryName][0].category_image_url)})`;
        let categoryNameText = document.createTextNode(categoryName);
        titleList.appendChild(siteIcon);
        titleList.appendChild(categoryNameText);
        categoryLink.appendChild(titleList);
        blogList.appendChild(categoryLink);
        let linkList = document.createElement('div');
        linkList.className = 'link-list';
        linkList.id = 'scrollable-lastai';
        let list = document.createElement('ol');
        list.className = 'yol-pad';
        articlesByCategory[categoryName].forEach(post => {
            let listItem = document.createElement('li');
            listItem.setAttribute('data-article-id', post.id.toString());
            let deleteButton = document.createElement('button');
            deleteButton.id = 'delete-fav';
            deleteButton.title = 'Delete this AI tools';
            deleteButton.textContent = 'x';
            deleteButton.addEventListener('click', () => removeFavoriteFromCookie(post.id));
            let postSiteIcon = document.createElement('span');
            postSiteIcon.className = 'site-icon';
            postSiteIcon.style.backgroundImage = `url(${encodeURI(post.siteicon)})`;
            let postLink = document.createElement('a');
            postLink.className = 'tooltips';
            postLink.id = `websites-ground-type-${post.website_type}`;
            postLink.href = encodeURI(post.permalink);
            postLink.target = '_blank';
            let postTitle = document.createElement('span');
            postTitle.className = 'stop-wordy';
            postTitle.textContent = post.title;
            postLink.appendChild(postTitle);
            let reviewLink = document.createElement('a');
            reviewLink.className = 'site-review2';
            reviewLink.href = encodeURI(post.siteurl);
            reviewLink.target = '_blank';
            reviewLink.rel = 'nofollow noopener';
            reviewLink.title = 'Visiter ' + post.title;
            let reviewIcon = document.createElement('span');
            reviewIcon.className = `websites-type-${post.website_type}`;
            let reviewImage = document.createElement('img');
            reviewImage.src = `/wp-content/uploads/2023/07/links-ai-${post.website_type}.webp`;
            reviewImage.alt = post.title;
            reviewImage.title = post.title;
            reviewImage.width = 14;
            reviewImage.height = 14;
            reviewIcon.appendChild(reviewImage);
            reviewLink.appendChild(reviewIcon);
            listItem.appendChild(deleteButton);
            listItem.appendChild(postSiteIcon);
            listItem.appendChild(postLink);
            listItem.appendChild(reviewLink);
            list.appendChild(listItem)
        });
        linkList.appendChild(list);
        blogList.appendChild(linkList);
        gridItem.appendChild(blogList);
        favoritesContainer.appendChild(gridItem)
    })
}
document.addEventListener('DOMContentLoaded', function() {
    var refreshButton = document.getElementById('refreshFavoritesBtn');
    if (refreshButton) {
        refreshButton.addEventListener('click', fetchFavoritePostsAndUpdateUI)
    }
});