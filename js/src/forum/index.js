import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import CommentPost from 'flarum/forum/components/CommentPost';

app.initializers.add('justoverclock/broken-links-checker', () => {
  extend(CommentPost.prototype, 'oncreate', function () {

    const postBody = this.element.querySelector('.Post-body');
    const linkTag = postBody.querySelectorAll('a');

    const httpGet = async (url) => {
      try {
        return await fetch(url, {mode: 'no-cors'});
      } catch (error) {
        console.log(
          `${app.translator.trans('justoverclock-broken-links-checker.forum.broken-link')}: ${url}`
        );
      }
    };

    linkTag.forEach((link) => {
      if (link.classList.contains('PostMention')) return;

      const href = link.href;

      if (link) {
        httpGet(href).then((statusCode) => {
          if (!statusCode) {
            link.classList.add('deactivateLink');

            const brokenLink = document.createElement('span');
            brokenLink.setAttribute('class', 'isBroken');
            brokenLink.innerText = app.translator.trans('justoverclock-broken-links-checker.forum.broken');
            link.insertAdjacentElement('afterend', brokenLink);
          }
        });
      }
    });
  });
});
