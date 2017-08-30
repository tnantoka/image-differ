// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const BlinkDiff = require('blink-diff')
const os = require('os')
const path = require('path')

const imageOutputPath = path.join(os.tmpdir(), 'image-differ.png');

const image1 = document.querySelector('.image1')
const image2 = document.querySelector('.image2')
const images = document.querySelectorAll('img')

const progress = document.querySelector('.progress')

const onDrop = (img) => {
  return e => {
    const file = e.dataTransfer.files[0]
    img.onload = onLoad
    img.src = file.path
  }
}

const onLoad = e => {
  const paths = Array.from(images, image => image.getAttribute('src') || '')
  const imageAPath = paths[0]
  const imageBPath = paths[1]
  if (imageAPath.length && imageBPath.length) {
    const diff = new BlinkDiff({
      imageAPath,
      imageBPath,
      imageOutputPath,
      composition: false,
    })
    images[2].src = ''
    progress.classList.add('loading')
    diff.run((error, result) => {
      progress.classList.remove('loading')
      if (error) {
        alert(error)
      } else {
        images[2].src = imageOutputPath
      }
    })
  }
}

document.ondragover = document.ondrop = e => e.preventDefault()

image1.addEventListener('drop', onDrop(images[0]))
image2.addEventListener('drop', onDrop(images[1]))
