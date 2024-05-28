(function(){"use strict";var e={4403:function(e,t,i){var n=i(5130),r=i(6768);const l={id:"app"},o={key:0,class:"spinner-container"},s={key:1};function a(e,t,i,n,a,c){const u=(0,r.g2)("FiltersComponent"),g=(0,r.g2)("BreadcrumbsComponent"),p=(0,r.g2)("Spinner"),d=(0,r.g2)("GigList"),f=(0,r.g2)("ModalComponent");return(0,r.uX)(),(0,r.CE)("div",l,[(0,r.Lk)("header",null,[(0,r.bF)(u,{filters:a.filters,onClearAll:c.clearAllFilters},null,8,["filters","onClearAll"]),(0,r.bF)(g,{filters:a.filters,onRemoveFilter:c.removeFilter},null,8,["filters","onRemoveFilter"])]),a.loading?((0,r.uX)(),(0,r.CE)("div",o,[(0,r.bF)(p)])):((0,r.uX)(),(0,r.CE)("div",s,[(0,r.bF)(d,{gigs:c.filteredGigs,onSelectGig:c.selectGig,onApplyFilter:c.applyFilter},null,8,["gigs","onSelectGig","onApplyFilter"]),a.selectedGig?((0,r.uX)(),(0,r.Wv)(f,{key:0,gig:a.selectedGig,onClose:t[0]||(t[0]=e=>a.selectedGig=null)},null,8,["gig"])):(0,r.Q3)("",!0)]))])}var c=i(8355),u={apiEndpoint:"http://192.168.0.48:9988/wp-json/jbs/v2/tickets"};const g={class:"filters"};function p(e,t,i,n,l,o){return(0,r.uX)(),(0,r.CE)("div",g,[(0,r.Lk)("button",{onClick:t[0]||(t[0]=t=>e.$emit("clear-all"))},"Clear All")])}var d={name:"FiltersComponent",props:{filters:Object}},f=i(1241);const v=(0,f.A)(d,[["render",p],["__scopeId","data-v-75a636ae"]]);var m=v,k=i(4232);const y={class:"breadcrumbs"},h=["onClick"];function C(e,t,i,n,l,o){return(0,r.uX)(),(0,r.CE)("div",y,[((0,r.uX)(!0),(0,r.CE)(r.FK,null,(0,r.pI)(o.activeFilters,((t,i)=>((0,r.uX)(),(0,r.CE)("span",{key:i},[(0,r.eW)((0,k.v_)(t.key)+": "+(0,k.v_)(t.value)+" ",1),(0,r.Lk)("button",{onClick:i=>e.$emit("remove-filter",t.key)},"x",8,h)])))),128))])}var b={name:"BreadcrumbsComponent",props:{filters:{type:Object,required:!0}},computed:{activeFilters(){return Object.entries(this.filters).filter((([,e])=>e)).map((([e,t])=>({key:e,value:t})))}}};const _=(0,f.A)(b,[["render",C],["__scopeId","data-v-87f1300a"]]);var F=_;const G={class:"sort-options"},A={class:"grid-container"};function L(e,t,i,n,l,o){const s=(0,r.g2)("GigBox");return(0,r.uX)(),(0,r.CE)("div",null,[(0,r.Lk)("div",G,[(0,r.Lk)("button",{onClick:t[0]||(t[0]=e=>n.sort("artist","asc"))},"Sort Artist Asc"),(0,r.Lk)("button",{onClick:t[1]||(t[1]=e=>n.sort("artist","desc"))},"Sort Artist Desc"),(0,r.Lk)("button",{onClick:t[2]||(t[2]=e=>n.sort("date","asc"))},"Sort Date Asc"),(0,r.Lk)("button",{onClick:t[3]||(t[3]=e=>n.sort("date","desc"))},"Sort Date Desc")]),(0,r.Lk)("div",A,[((0,r.uX)(!0),(0,r.CE)(r.FK,null,(0,r.pI)(n.sortedGigs,(e=>((0,r.uX)(),(0,r.Wv)(s,{key:e.id,gig:e,onClick:t=>n.selectGig(e),onFilter:n.applyFilter},null,8,["gig","onClick","onFilter"])))),128))])])}var E=i(144);const O={class:"gig-box"},j=["src"];function X(e,t,i,n,l,o){return(0,r.uX)(),(0,r.CE)("div",O,[(0,r.Lk)("div",{class:"gigtype",onClick:t[0]||(t[0]=e=>o.filterBy("gigtype"))},(0,k.v_)(i.gig.gigtype[0]?.name),1),(0,r.Lk)("img",{src:i.gig.image_sml,alt:"Gig Image",onClick:t[1]||(t[1]=(...e)=>o.showDetails&&o.showDetails(...e))},null,8,j),(0,r.Lk)("h3",{onClick:t[2]||(t[2]=e=>o.filterBy("title"))},(0,k.v_)(i.gig.title),1),(0,r.Lk)("p",{onClick:t[3]||(t[3]=e=>o.filterBy("date"))},(0,k.v_)(i.gig.date),1),(0,r.Lk)("p",{onClick:t[4]||(t[4]=e=>o.filterBy("price"))},(0,k.v_)(i.gig.price>0?`£${i.gig.price}`:"Free"),1),i.gig.artist?((0,r.uX)(),(0,r.CE)("p",{key:0,onClick:t[5]||(t[5]=e=>o.filterBy("artist")),class:"artist"},(0,k.v_)(i.gig.artist[0]?.name),1)):(0,r.Q3)("",!0),i.gig.venue?((0,r.uX)(),(0,r.CE)("p",{key:1,onClick:t[6]||(t[6]=e=>o.filterBy("venue"))},(0,k.v_)(i.gig.venue[0]?.name),1)):(0,r.Q3)("",!0)])}var S={name:"GigBox",props:{gig:{type:Object,required:!0}},methods:{showDetails(){this.$emit("click")},filterBy(e){const t="date"===e?this.gig.date.split("-")[0]:this.gig[e][0]?.name;this.$emit("filter",{type:e,value:t})}}};const w=(0,f.A)(S,[["render",X],["__scopeId","data-v-59d1391e"]]);var B=w,x={name:"GigList",components:{GigBox:B},props:{gigs:{type:Array,required:!0}},setup(e,{emit:t}){const i=(0,E.KR)(null),n=(0,E.KR)(null),l=(0,r.EW)((()=>i.value?[...e.gigs].sort(((e,t)=>{let r=e[i.value]?.[0]?.name||"",l=t[i.value]?.[0]?.name||"";return"date"===i.value&&(r=e.date,l=t.date),"asc"===n.value?r.localeCompare(l):l.localeCompare(r)})):e.gigs)),o=(e,t)=>{i.value=e,n.value=t},s=e=>{t("select-gig",e)},a=e=>{t("apply-filter",e)};return{sortedGigs:l,sort:o,selectGig:s,applyFilter:a}}};const I=(0,f.A)(x,[["render",L],["__scopeId","data-v-83c89be4"]]);var D=I;const $={class:"modal-content"},M=["src"];function W(e,t,i,l,o,s){return(0,r.uX)(),(0,r.CE)("div",{class:"modal-backdrop",onClick:t[1]||(t[1]=(0,n.D$)(((...e)=>s.close&&s.close(...e)),["self"]))},[(0,r.Lk)("div",$,[(0,r.Lk)("button",{class:"close-button",onClick:t[0]||(t[0]=(...e)=>s.close&&s.close(...e))},"×"),(0,r.Lk)("img",{src:i.gig.image_lg,alt:"Gig Image"},null,8,M)])])}var q={name:"GigModal",props:{gig:{type:Object,required:!0}},methods:{close(){this.$emit("close")}}};const K=(0,f.A)(q,[["render",W],["__scopeId","data-v-1563efa6"]]);var P=K;const R={class:"spinner"};function T(e,t,i,n,l,o){return(0,r.uX)(),(0,r.CE)("div",R)}var Q={name:"SpinnerComponent"};const z=(0,f.A)(Q,[["render",T],["__scopeId","data-v-c3c36ca4"]]);var H=z,J={name:"App",components:{FiltersComponent:m,BreadcrumbsComponent:F,GigList:D,ModalComponent:P,Spinner:H},data(){return{gigs:[],filters:{artist:null,venue:null,gigtype:null,date:null},selectedGig:null,loading:!1}},computed:{filteredGigs(){let e=this.gigs;for(const[t,i]of Object.entries(this.filters))i&&(e=e.filter((e=>"date"===t?e.date.startsWith(i):!!Array.isArray(e[t])&&e[t].some((e=>e.name===i)))));return e}},methods:{async fetchGigs(){this.loading=!0;try{const e=await c.A.get(u.apiEndpoint);this.gigs=e.data}catch(e){console.error("Error fetching gigs data:",e)}finally{this.loading=!1}},clearAllFilters(){this.filters={artist:null,venue:null,gigtype:null,date:null}},removeFilter(e){this.filters[e]=null},applyFilter(e){this.filters[e.type]=e.value},selectGig(e){this.selectedGig=e}},created(){this.fetchGigs()}};const N=(0,f.A)(J,[["render",a]]);var U=N,V=i(1387);const Y=[{path:"/",name:"GigList",component:D}],Z=(0,V.aE)({history:(0,V.LA)("/vue-ticket-thing/"),routes:Y});var ee=Z;(0,n.Ef)(U).use(ee).mount("#app")}},t={};function i(n){var r=t[n];if(void 0!==r)return r.exports;var l=t[n]={exports:{}};return e[n].call(l.exports,l,l.exports,i),l.exports}i.m=e,function(){var e=[];i.O=function(t,n,r,l){if(!n){var o=1/0;for(u=0;u<e.length;u++){n=e[u][0],r=e[u][1],l=e[u][2];for(var s=!0,a=0;a<n.length;a++)(!1&l||o>=l)&&Object.keys(i.O).every((function(e){return i.O[e](n[a])}))?n.splice(a--,1):(s=!1,l<o&&(o=l));if(s){e.splice(u--,1);var c=r();void 0!==c&&(t=c)}}return t}l=l||0;for(var u=e.length;u>0&&e[u-1][2]>l;u--)e[u]=e[u-1];e[u]=[n,r,l]}}(),function(){i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,{a:t}),t}}(),function(){i.d=function(e,t){for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}}(),function(){i.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){var e={524:0};i.O.j=function(t){return 0===e[t]};var t=function(t,n){var r,l,o=n[0],s=n[1],a=n[2],c=0;if(o.some((function(t){return 0!==e[t]}))){for(r in s)i.o(s,r)&&(i.m[r]=s[r]);if(a)var u=a(i)}for(t&&t(n);c<o.length;c++)l=o[c],i.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return i.O(u)},n=self["webpackChunkticket_thing"]=self["webpackChunkticket_thing"]||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var n=i.O(void 0,[504],(function(){return i(4403)}));n=i.O(n)})();
//# sourceMappingURL=app.46372cc2.js.map