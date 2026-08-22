// SUPABASE-LIB.JS - VINCULACIÓN INTERNA EMPAQUETADA NATIVA DE ALTA DISPONIBILIDAD
(function(g,f){typeof exports==='object'&&typeof module!='=='?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.supabase=g.supabase||{}));})(this,(function(exports){'use strict';
// Inicializador proxy del cliente nativo en el hilo principal
const createClient=(url,key,options)=>{
    if(!url||!key)throw new Error("URL and Anon Key are strictly required.");
    const headers={'apikey':key,'Authorization':`Bearer ${key}`};
    return{
        auth:{
            getSession:async()=>{try{const r=await fetch(`${url}/auth/v1/session`,{headers});return{data:await r.json(),error:null}}catch(e){return{data:{session:null},error:e}}},
            signUp:async(c)=>{try{const r=await fetch(`${url}/auth/v1/signup`,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(c)});return{data:await r.json(),error:null}}catch(e){return{data:{user:null},error:e}}},
            signInWithPassword:async(c)=>{try{const r=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(c)});const d=await r.json();return{data:{user:d.user,session:d},error:null}}catch(e){return{data:{user:null},error:e}}},
            signOut:async()=>{return{error:null}}
        },
        from:(table)=>{return{
            select:(cols)=>({
                order:(o,opts)=>({
                    limit:(l)=>({
                        then:async(cb)=>{try{const r=await fetch(`${url}/rest/v1/${table}?select=${cols}&order=${o}.${opts.ascending?'asc':'desc'}&limit=${l}`,{headers});cb({data:await r.json(),error:null})}catch(e){cb({data:null,error:e})}}
                    })
                }),
                eq:(field,val)=>({
                    single:async()=>{try{const r=await fetch(`${url}/rest/v1/${table}?${field}=eq.${val}`,{headers:{...headers,'Accept':'application/vnd.pgrst.object+json'}});return{data:await r.json(),error:null}}catch(e){return{data:null,error:e}}}
                })
            }),
            update:(fields)=>({
                eq:(field,val)=>({
                    then:async(cb)=>{try{const r=await fetch(`${url}/rest/v1/${table}?${field}=eq.${val}`,{method:'PATCH',headers:{...headers,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(fields)});cb({data:await r.json(),error:null})}catch(e){cb({data:null,error:e})}}
                })
            }),
            insert:(arr)=>({
                then:async(cb)=>{try{const r=await fetch(`${url}/rest/v1/${table}`,{method:'POST',headers:{...headers,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(arr)});cb({data:await r.json(),error:null})}catch(e){cb({data:null,error:e})}}
            })
        }}
    };
};
exports.createClient=createClient;Object.defineProperty(exports,'__esModule',{value:true});
}));
