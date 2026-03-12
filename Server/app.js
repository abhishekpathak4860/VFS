// import { createWriteStream, rename, rm } from "fs";
// import { open, readdir } from "fs/promises";
// import http from "http";
// import mime from "mime-types";

// const server = http.createServer(async (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   res.setHeader("Access-Control-Allow-Methods", "*");

//   if (req.method === "GET") {
//     // Get Method
//     if (req.url === "/") {
//       serveDirectory(req, res);
//     } else {
//       try {
//         const [url, queryString] = req.url.split("?");

//         const queryParams = {};
//         queryString?.split("&").forEach((pair) => {
//           const [key, value] = pair.split("=");
//           queryParams[key] = value;
//         });

//         const fileHandle = await open(`./Storage${decodeURIComponent(url)}`);
//         const stats = await fileHandle.stat();

//         if (stats.isDirectory()) {
//           serveDirectory(req, res);
//         } else {
//           const readStream = fileHandle.createReadStream(fileHandle);
//           res.setHeader(
//             "Content-Type",
//             mime.contentType(url.split("/")[url.split("/").length - 1])
//           );
//           res.setHeader("Content-Length", stats.size);
//           if (queryParams.action === "download") {
//             res.setHeader(
//               "Content-Disposition",
//               `attachment;filename="${url.slice(1)}"`
//             );
//           }
//           readStream.pipe(res);
//         }
//       } catch (err) {
//         // console.log(url);
//         res.end("Not Found");
//       }
//     }
//   } else if (req.method === "OPTIONS") {
//     res.end("OK");
//   } else if (req.method === "POST") {
//     // Post Method
//     const filename = req.headers.filename;
//     const writeStream = createWriteStream(`./Storage/${filename}`);
//     req.on("data", (chunk) => {
//       writeStream.write(chunk);
//     });
//     req.on("end", () => {
//       writeStream.end();
//       res.end("File Uploaded Successfully");
//     });
//   } else if (req.method === "DELETE") {
//     // Delete method
//     req.on("data", (chunk) => {
//       const filename = chunk.toString();
//       rm(`./Storage/${filename}`, (err) => {
//         if (err) {
//           res.statusCode = 500;
//           res.end("Error deleting file");
//         } else {
//           res.end("File deleted successfully");
//         }
//       });
//     });
//   } else if (req.method === "PATCH") {
//     req.on("data", async (chunk) => {
//       const data = JSON.parse(chunk.toString());
//       rename(
//         `./Storage/${data.oldfilename}`,
//         `./Storage/${data.newfilename}`,
//         (err) => {
//           if (err) {
//             return res.end("Error renaming file");
//           } else {
//             res.end("File Renamed Successfully");
//           }
//         }
//       );
//     });
//   }
// });

// async function serveDirectory(req, res) {
//   // This fun() is rendering all files and folders
//   const [url, queryString] = req.url.split("?");

//   const itemlist = await readdir(`./Storage/${decodeURIComponent(url)}`);
//   res.setHeader("Content-Type", "application/json");
//   res.end(JSON.stringify(itemlist));
// }
// server.listen(5000, () => console.log("Server Started"));
console.log("hello");
