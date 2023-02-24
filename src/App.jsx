import { useCallback, useEffect, useState } from 'react'
import { Stage, Layer, Text, Rect, Image } from 'react-konva'
import './App.css'
import InputModal from './InputModal';

function App() {
  const [texts, setTexts] = useState(["heloo"]);
  const [images, setImages] = useState([]);
  const [showInputModal, setShowInputModal] = useState(false);

  const width = Math.min(window.innerWidth, 400);
  const height = Math.min(window.innerHeight, 700);

  const _handleCreateText = () => {
    setShowInputModal(true);
  };

  const _addText = (text) => {
    setTexts([...texts, text]);
  };

  const _handleFile = evt => {
    var tgt = evt.target || window.event.srcElement,
      files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = function () {
        const newImg = new window.Image();
        newImg.src = fr.result;

        const domImg = document.body.appendChild(newImg);
        domImg.style.visibility = "hidden";
        domImg.style.position = "absolute";
        domImg.style.opacity = 0;
        domImg.style.zIndex = -1;

        domImg.onload = () => {

          setImages(prev => ([...prev, {
            id: prev.length + 1,
            img: newImg,
            position: { x: (width / 2) - (domImg.getBoundingClientRect().width / 2), y: (height / 2) - (domImg.getBoundingClientRect().height / 2) },
            isPinching: false,
            width: domImg.getBoundingClientRect().width > window.innerWidth ? window.innerWidth : domImg.getBoundingClientRect().width,
            height: domImg.getBoundingClientRect().width > window.innerWidth ? (domImg.getBoundingClientRect().height * window.innerWidth) / domImg.getBoundingClientRect().width : domImg.getBoundingClientRect().height,
            startPinchDist: 1,
            pinchDist: 1,
            scale: 1,
            startPinchScale: 1,
            rotation: 0,
            startPinchRotation: 0,
            startRotation: 0,
            order: prev.length + 1
          }
          ]));

          domImg.remove();
        }

      }
      fr.readAsDataURL(files[0]);
    }

  };
  
  const _touchStart = (e, id) => {
    if (e.evt.touches.length > 1) {
      const rot = Math.atan2(e.evt.touches[0].pageY - e.evt.touches[1].pageY, e.evt.touches[0].pageX - e.evt.touches[1].pageX) * 180 / Math.PI;
      // scaling = true;
      var dist = Math.hypot(
        e.evt.touches[0].pageX - e.evt.touches[1].pageX,
        e.evt.touches[0].pageY - e.evt.touches[1].pageY);

      const newImages = [...images];
      const index = newImages.findIndex(i => i.id == id);
      newImages[index].isPinching = true;
      newImages[index].startPinchDist = dist;
      newImages[index].startPinchScale = newImages[index].scale;
      newImages[index].startPinchRotation = rot;
      newImages[index].startRotation = newImages[index].rotation;
      setImages(newImages);
    }
  };

  const _touchMove = useCallback((e, id) => {
    if (e.evt.touches.length > 1) {
      const rot = Math.atan2(e.evt.touches[0].pageY - e.evt.touches[1].pageY, e.evt.touches[0].pageX - e.evt.touches[1].pageX) * 180 / Math.PI;
      // scaling = true;
      var dist = Math.hypot(
        e.evt.touches[0].pageX - e.evt.touches[1].pageX,
        e.evt.touches[0].pageY - e.evt.touches[1].pageY);

      const newImages = [...images];
      const index = newImages.findIndex(i => i.id == id);
      
      newImages[index].isPinching = true;
      newImages[index].pinchDist = dist;
      newImages[index].scale = Math.max(.1, Math.min(4, newImages[index].startPinchScale + (newImages[index].pinchDist - newImages[index].startPinchDist) / 100));
      newImages[index].rotation = -1 * (newImages[index].startPinchRotation - rot) + newImages[index].startRotation;
      // console.log(1+(newImages[index].pinchDist-newImages[index].startPinchDist)/100);
      // alert(dist);
      setImages(newImages);
    }
  }, [images])

  const _touchEnd = (e, id) => {

    // scaling = true;

    const newImages = [...images];
    const index = newImages.findIndex(i => i.id == id);

    newImages[index].isPinching = false;

    // alert(dist);
    setImages(newImages);

  }

  return (
    <div className="app-container">
      <div className="input-file">
        <input type="file" onChange={_handleFile} />
        <label>
          Image
        </label>
      </div>
      <Stage width={width} height={height}>
        <Layer>
          <Rect width={width} height={height} fill="#fff" onClick={_handleCreateText} onTap={_handleCreateText}></Rect>
        </Layer>
        <Layer>
          {texts.map(t =>
            <Text
              text={t}
              fontSize={32}
              x={width / 2}
              y={height / 2}
              fill="#000"
              draggable
            />
          )}
          {images.map(img =>
            <Image
              image={img.img}
              draggable
              // position={img.position}
              // width={img.width}
              // height={img.height}
              // onTouchStart={e => _touchStart(e, img.id)}
              onDragStart={e => _touchStart(e, img.id)}
              offsetX={img.width / 2}
              offsetY={img.height / 2}
              // onTouchMove={e => _touchMove(e, img.id)}
              onDragMove={e => _touchMove(e, img.id)}
              onTouchEnd={e => _touchEnd(e, img.id)}
              // scaleX={10}
              // scaleY={.5}
              rotation={img.rotation}
              // rotationDeg={img.rot}
              scale={{ x: Math.max(.1, img.scale), y: Math.max(.1, img.scale) }}
            />
          )}
        </Layer>
      </Stage>
      {showInputModal ? <InputModal closeModal={() => setShowInputModal(false)} addText={_addText} /> : ''}
    </div>
  )
}

export default App
