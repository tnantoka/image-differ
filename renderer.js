// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const looksSame = require('looks-same')
const os = require('os')
const path = require('path')

const outputPath = path.join(os.tmpdir(), 'image-differ.png')

const referenceContainer = document.querySelector('.reference')
const currentContainer = document.querySelector('.current')
const imgs = document.querySelectorAll('img')

const progress = document.querySelector('.progress')

const onDrop = (img) => {
  return e => {
    const file = e.dataTransfer.files[0]
    img.onload = onLoad
    img.src = file.path
  }
}

const onLoad = e => {
  const paths = Array.from(imgs, image => image.getAttribute('src') || '')
  const referencePath = paths[0]
  const currentPath = paths[1]

  if (referencePath.length && currentPath.length) {
    progress.classList.add('loading')
    imgs[2].src = ''

    looksSame.createDiff({
      reference: referencePath,
      current: currentPath,
      diff: outputPath,
      highlightColor: '#ff00ff',
      strict: false,
      tolerance: 2.5,
    }, error => {
      progress.classList.remove('loading')
      if (error) {
        alert(error)
        return
      }
      imgs[2].src = outputPath
    })
  }
}

document.ondragover = document.ondrop = e => e.preventDefault()

referenceContainer.addEventListener('drop', onDrop(imgs[0]))
currentContainer.addEventListener('drop', onDrop(imgs[1]))
