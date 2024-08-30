import{S as u,i}from"./assets/vendor-5ObWk2rO.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(e){if(e.ep)return;e.ep=!0;const r=t(e);fetch(e.href,r)}})();const f=document.querySelector(".search-form"),c=document.querySelector(".gallery");let p=new u(".gallery a",{captionsData:"alt",captionDelay:250});f.addEventListener("submit",d);function d(s){s.preventDefault();const o=new FormData(s.target),{search:t}=Object.fromEntries(o.entries()),n=t.trim();b(n)}const g={method:"GET"},h="45713433-433c1b648e48abad27090f3cc",y="https://pixabay.com/api/?";function b(s){if(!s){i.error({title:"Error",message:"Пошуковий запит порожній."});return}const o=new URLSearchParams({key:h,q:s,image_type:"photo",orientation:"horizontal",safesearch:!0});fetch(`${y}${o}`,g).then(t=>{if(!t.ok)throw new Error(t.status);return t.json()}).then(t=>{if(c.innerHTML="",t.hits.length===0){i.info({title:"Info",message:"Зображення не знайдені за вашим запитом."});return}const n=L(t);c.insertAdjacentHTML("beforeend",n),p.refresh()}).catch(t=>{console.error("Помилка:",t),i.error({title:"Error",message:`Помилка: ${t.message}`})})}function L(s){return s.hits.map(({webformatURL:t,largeImageURL:n,tags:e,likes:r,views:a,comments:l,downloads:m})=>`
            <li class="gallery-item">
              <a class="gallery-link" href="${n}">
                <img
                  class="gallery-image"
                  src="${t}"
                  alt="${e}"
                  loading="lazy"
              /></a>
              <ul class="img-content-wrapper">
                <li class="img-content-descr">Likes<span>${r}</span></li>
                <li class="img-content-descr">Views<span>${a}</span></li>
                <li class="img-content-descr">Comments<span>${l}</span></li>
                <li class="img-content-descr">Downloads<span>${m}</span></li>
              </ul>
            </li>
		`).join("")}
//# sourceMappingURL=index.js.map
