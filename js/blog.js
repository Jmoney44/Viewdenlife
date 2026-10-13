const panel = document.getElementById('mobilePanel');
const menuToggle = document.getElementById('menuToggle');
const menuIcon = menuToggle?.querySelector('svg');
function closeMenu(){
  panel?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded','false');
  menuToggle?.setAttribute('aria-label','Open navigation');
  if(menuIcon) menuIcon.innerHTML='<path d="M4 7h16M4 12h16M4 17h16"/>';
}
menuToggle?.addEventListener('click',()=>{
  const open=panel.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded',String(open));
  menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  if(menuIcon) menuIcon.innerHTML=open?'<path d="m6 6 12 12M18 6 6 18"/>':'<path d="M4 7h16M4 12h16M4 17h16"/>';
});
panel?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
document.getElementById('year').textContent=new Date().getFullYear();
const searchInput=document.getElementById('articleSearch');
const filterButtons=[...document.querySelectorAll('.topic-filter')];
const cards=[...document.querySelectorAll('.article-card')];
const emptyState=document.getElementById('articleEmpty');
let activeFilter='all';
function filterArticles(){
  const query=(searchInput.value||'').trim().toLowerCase();
  let visible=0;
  cards.forEach(card=>{
    const categoryMatch=activeFilter==='all'||card.dataset.topic===activeFilter;
    const searchMatch=!query||(card.dataset.search+' '+card.innerText).toLowerCase().includes(query);
    const show=categoryMatch&&searchMatch;
    card.hidden=!show;
    if(show) visible++;
  });
  emptyState.hidden=visible>0;
}
filterButtons.forEach(button=>button.addEventListener('click',()=>{
  activeFilter=button.dataset.filter;
  filterButtons.forEach(item=>item.classList.toggle('selected',item===button));
  filterArticles();
}));
searchInput.addEventListener('input',filterArticles);
document.querySelectorAll('.read-link').forEach(button=>button.addEventListener('click',()=>{
  const notice=document.getElementById('notice');
  notice.textContent='“'+button.dataset.title+'” is a topic preview. The full article will be published after Viewdenlife supplies and reviews the content.';
  notice.classList.add('show');
  window.clearTimeout(window.blogNoticeTimer);
  window.blogNoticeTimer=window.setTimeout(()=>notice.classList.remove('show'),4800);
}));
