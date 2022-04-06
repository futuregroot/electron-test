import { useState, useMemo } from 'react'
import { FilesViewer } from './FilesViewer'

const fs = window.require('fs')
const pathModule = window.require('path')
const https = window.require('https')

const { app, ipcRenderer } = window.require('@electron/remote')


const formatSize = size => {
  var i = Math.floor(Math.log(size) / Math.log(1024))
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  )
}

function App() {
  const [path, setPath] = useState(app.getAppPath())
  const [ videoUrl, setVideoUrl] = useState("https://labang-signup.s3.ap-northeast-2.amazonaws.com/images/movieFile/032f8180-a41b-11ec-a302-592a48c3cc8b.mp4")
  const [ isDownloading, setIsDownloading] = useState(false)

  const files = useMemo(
    () =>
      fs
        .readdirSync(path)
        .map(file => {
          const stats = fs.statSync(pathModule.join(path, file))
          return {
            name: file,
            size: stats.isFile() ? formatSize(stats.size ?? 0) : null,
            directory: stats.isDirectory()
          }
        })
        .sort((a, b) => {
          if (a.directory === b.directory) {
            return a.name.localeCompare(b.name)
          }
          return a.directory ? -1 : 1
        }),
    [path]
  )
  const getFile = (fileUrl, destination, cb) =>{
    setIsDownloading(true)
    let file = fs.createWriteStream(destination);
    let request = https.get(fileUrl, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(cb);  // close() is async, call cb after close completes.
      });
    }).on('error', function(err) { // Handle errors
      fs.unlink(destination); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
  }

  const onBack = () => setPath(pathModule.dirname(path))
  const onOpen = folder => setPath(pathModule.join(path, folder))

  const [searchString, setSearchString] = useState('')
  const filteredFiles = files.filter(s => s.name.startsWith(searchString))
  return (
    <div className="container mt-2">
      <h4>{path} 안녕하세요.</h4>

      <video controls>
        <source src={require('./assets/500videos.mp4').default} type="video/mp4"></source>
      </video>
      <div className="row">
      {isDownloading?"downloading":""}
      <input
          value={videoUrl}
          onChange={event => setVideoUrl(event.target.value)}
          className="form-control form-control-sm flex-1"
          placeholder="video url"
        />
        <button className="btn btn-primary" onClick={(e)=>getFile(videoUrl, pathModule.resolve(path, "src/assets/500videos.mp4"), ()=>{setVideoUrl(""); setIsDownloading(false)})}>go</button>
      </div>

      <div className="form-group mt-4 mb-2">
        <input
          value={searchString}
          onChange={event => setSearchString(event.target.value)}
          className="form-control form-control-sm"
          placeholder="File search"
        />
      </div>
      <FilesViewer files={filteredFiles} onBack={onBack} onOpen={onOpen} />
    </div>
  )
}

export default App
