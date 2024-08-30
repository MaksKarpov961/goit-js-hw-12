import{S as u,i}from"./assets/vendor-5ObWk2rO.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(e){if(e.ep)return;e.ep=!0;const r=t(e);fetch(e.href,r)}})();const f=document.querySelector(".search-form"),c=document.querySelector(".gallery");let p=new u(".gallery a",{captionsData:"alt",captionDelay:250});f.addEventListener("submit",d);function d(o){o.preventDefault();const s=new FormData(o.target),{search:t}=Object.fromEntries(s.entries()),n=t.trim();L(n)}const g={method:"GET"},h="45713433-433c1b648e48abad27090f3cc",y="https://pixabay.com/api/?";function L(o){if(!o){i.error({title:"Error",message:"The search query is empty.",position:"topRight"});return}b();const s=new URLSearchParams({key:h,q:o,image_type:"photo",orientation:"horizontal",safesearch:!0});fetch(`${y}${s}`,g).then(t=>{if(!t.ok)throw new Error(t.status);return t.json()}).then(t=>{if(c.innerHTML="",t.hits.length===0){i.info({position:"topRight",title:"Info",message:"Sorry, there are no images matching your search query. Please try again!"});return}const n=$(t);c.insertAdjacentHTML("beforeend",n),p.refresh()}).catch(t=>{console.error("Помилка:",t),i.error({title:"Error",message:`Error: ${t.message}`,position:"topRight"})}).finally(()=>{w()})}function b(){c.insertAdjacentHTML("beforebegin",'<span class="loader"></span>')}function w(){const o=document.querySelector(".loader");o&&o.remove()}function $(o){return o.hits.map(({webformatURL:t,largeImageURL:n,tags:e,likes:r,views:a,comments:l,downloads:m})=>`
            <li class="gallery-item hvr-grow">
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
