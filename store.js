const panel = document.getElementById('mobilePanel');
const menuToggle = document.getElementById('menuToggle');
const menuIcon = menuToggle?.querySelector('svg');
function closeMenu(){ panel?.classList.remove('open'); menuToggle?.setAttribute('aria-expanded','false'); menuToggle?.setAttribute('aria-label','Open navigation'); if(menuIcon) menuIcon.innerHTML='<path d="M4 7h16M4 12h16M4 17h16"/>'; }
menuToggle?.addEventListener('click',()=>{ const open=panel.classList.toggle('open'); menuToggle.setAttribute('aria-expanded',String(open)); menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation'); if(menuIcon) menuIcon.innerHTML=open?'<path d="m6 6 12 12M18 6 6 18"/>':'<path d="M4 7h16M4 12h16M4 17h16"/>'; });
panel?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
document.getElementById('year').textContent=new Date().getFullYear();
const searchInput=document.getElementById('categorySearch');
const chips=[...document.querySelectorAll('.filter-chip')];
const cards=[...document.querySelectorAll('.category-card')];
const emptyState=document.getElementById('emptyState');
let activeFilter='all';
function filterCards(){const query=(searchInput.value||'').trim().toLowerCase();let visible=0;cards.forEach(card=>{const categoryMatch=activeFilter==='all'||card.dataset.category===activeFilter;const searchMatch=!query||(card.dataset.search+' '+card.innerText).toLowerCase().includes(query);const show=categoryMatch&&searchMatch;card.hidden=!show;if(show)visible++;});emptyState.hidden=visible>0;}
chips.forEach(chip=>chip.addEventListener('click',()=>{activeFilter=chip.dataset.filter;chips.forEach(item=>item.classList.toggle('selected',item===chip));filterCards();}));
searchInput.addEventListener('input',filterCards);
document.querySelectorAll('.category-link').forEach(button=>button.addEventListener('click',()=>{const category=button.dataset.categoryName;const email='viewdenlife@gmail.com';const subject=encodeURIComponent('Enquiry about '+category);const body=encodeURIComponent('Hello Viewdenlife, I would like to know more about the '+category+' category and current product availability.');window.location.href=`mailto:${email}?subject=${subject}&body=${body}`;}));
