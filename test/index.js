'use strict'

const path = require('path')
const assert = require('assert')
const wesber = require('../')
const css = wesber.css
const html = wesber.html

function match(array, name) {
  return array.some((item) => {
    return item.file === name
  })
}

describe('css', () => {
  const file = path.resolve(__dirname, './files/style.css')
  const p = css(file)

  it('entry not found', (done) => {
    css(path.resolve(__dirname, './files/test.css'))
      .catch((error) => {
        assert(error instanceof Error)
        assert(error.message.match('no such file or directory'))
        done()
      })
  })

  it('basic info', (done) => {
    p.then((result) => {
      assert.equal(result.file, file)
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('background', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, 'background.png'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('font-face, src', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, 'font.png'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('cursor', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, 'cursor.png'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('content', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, 'content.png'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('border-image', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, 'border.png'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('border-image, prefix', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, 'moz.png'))
      assert(match(result.dependencies, 'webkit.png'))
      assert(match(result.dependencies, 'o.png'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('list-style', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, './list.png'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('list-style-image', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, './list-image.png'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('base64', (done) => {
    p.then((result) => {
      assert(result.dependencies.some((item) => {
        return item.base64 && /^data:image\/png;base64,/.test(item.file)
      }))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('entire uri', (done) => {
    p.then((result) => {
      assert(result.dependencies.some((item) => {
        return item.entireUri && /^https?:\/\//.test(item.file)
      }))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('file not found', (done) => {
    p.then((result) => {
      assert(result.dependencies.some((item) => {
        return !item.exists && item.file === 'foo.png'
      }))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('file exists', (done) => {
    p.then((result) => {
      assert(result.dependencies.some((item) => {
        return item.exists && item.file === 'html.png'
      }))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('hash', (done) => {
    p.then((result) => {
      let mark = null

      result.dependencies.forEach((item) => {
        if (!mark && item.file === 'background.png') {
          mark = item.hash
        }

        if (item.file === 'background.png') {
          assert.equal(item.hash, mark)
        }
      })
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('options #resolved', (done) => {
    css(file, { resolved: 'cursor' }).then((result) => {
      const dependencies = result.dependencies
      assert.equal(dependencies.length, 1)
      assert.equal(dependencies[0].file, 'cursor.png')
      done()
    }).catch((error) => {
      console.log(error)
    })
  })
})

describe('html', () => {
  const file = path.resolve(__dirname, './files/index.html')
  const p = html(file)

  it('entry not found', (done) => {
    css(path.resolve(__dirname, './files/test.html'))
      .catch((error) => {
        assert(error instanceof Error)
        assert(error.message.match('no such file or directory'))
        done()
      })
  })

  it('basic info', (done) => {
    p.then((result) => {
      assert.equal(result.file, file)
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('script', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, 'script.js'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('link', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, 'link.css'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('img', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, 'img.png'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('audio', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, 'audio.ogg'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('video', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, 'video.webm'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('iframe', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, 'iframe.htm'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('embed', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, 'embed.mov'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('object', (done) => {
    p.then((result) => {
      assert(match(result.dependencies, 'object.swf'))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('base64', (done) => {
    p.then((result) => {
      assert(result.dependencies.some((item) => {
        return item.base64 && /^data:image\/png;base64,/.test(item.file)
      }))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('entire uri', (done) => {
    p.then((result) => {
      assert(result.dependencies.some((item) => {
        return item.entireUri && /^https?:\/\//.test(item.file)
      }))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('file not found', (done) => {
    p.then((result) => {
      assert(result.dependencies.some((item) => {
        return !item.exists && item.file === 'foo.js'
      }))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('file exists', (done) => {
    p.then((result) => {
      assert(result.dependencies.some((item) => {
        return item.exists && item.file === 'html.png'
      }))
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('hash', (done) => {
    p.then((result) => {
      let mark = null

      result.dependencies.forEach((item) => {
        if (!mark && item.file === 'img.png') {
          mark = item.hash
        }

        if (item.file === 'img.png') {
          assert.equal(item.hash, mark)
        }
      })
      done()
    }).catch((error) => {
      console.log(error)
    })
  })

  it('options #resolved', (done) => {
    html(file, { resolved: [ 'link', 'iframe' ] }).then((result) => {
      const dependencies = result.dependencies
      assert.equal(dependencies.length, 2)
      assert.equal(dependencies[0].file, 'link.css')
      assert.equal(dependencies[1].file, 'iframe.htm')
      done()
    }).catch((error) => {
      console.log(error)
    })
  })
})
