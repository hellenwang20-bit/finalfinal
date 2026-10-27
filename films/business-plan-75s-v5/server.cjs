/* Dependency-free static server with HTTP Range support for frame-accurate media seeking. */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.json':'application/json','.ttf':'font/ttf','.woff2':'font/woff2','.wav':'audio/wav','.mp3':'audio/mpeg','.aac':'audio/aac','.ogg':'audio/ogg','.mp4':'video/mp4','.m4v':'video/mp4','.mov':'video/quicktime','.webm':'video/webm','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.md':'text/plain; charset=utf-8'};
function createProjectServer(root=__dirname){root=path.resolve(root);return http.createServer((req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(name==='/')name='/index.html';}catch{res.writeHead(400).end();return;}
 if(name.split('/').some(segment=>segment.startsWith('.'))){res.writeHead(403).end();return;}
 const file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.stat(file,(error,st)=>{
 if(error||!st.isFile()){res.writeHead(404).end();return;}
 res.setHeader('Content-Type',MIME[path.extname(file).toLowerCase()]||'application/octet-stream');res.setHeader('Accept-Ranges','bytes');
 let start=0,end=st.size-1,status=200;
 if(req.headers.range){const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);if(!m||(!m[1]&&!m[2])){res.writeHead(416,{'Content-Range':`bytes */${st.size}`}).end();return;}
 if(!m[1]){start=Math.max(0,st.size-Number(m[2]));}else{start=Number(m[1]);if(m[2])end=Math.min(end,Number(m[2]));}
 if(start>end||start>=st.size){res.writeHead(416,{'Content-Range':`bytes */${st.size}`}).end();return;}
 status=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${st.size}`);
 }
 res.writeHead(status,{'Content-Length':Math.max(0,end-start+1)});if(req.method==='HEAD'||!st.size){res.end();return;}
 const stream=fs.createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
 });
 });}
module.exports={createProjectServer};
if(require.main===module){const port=Number(process.env.PORT)||8000;createProjectServer().listen(port,'0.0.0.0',()=>console.log(`Final Final Studio preview running on port ${port}. Press Ctrl+C to stop.`));}
