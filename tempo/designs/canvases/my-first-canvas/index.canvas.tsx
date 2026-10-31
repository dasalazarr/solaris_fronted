import { Canvas, RouteStoryboard } from "tempo-sdk/canvas";

export default function GenerationCanvas() {
  return (
    <Canvas name="My first canvas">
      <RouteStoryboard
        id="landing-desktop"
        name="1–2 · Navegación y hero"
        route="/"
        layout={{ x: 0, y: 0, width: 1440, height: 900 }}
      />
      <RouteStoryboard
        id="demo-interactiva"
        name="7 · Demo: proceso de compra"
        route="/demo"
        layout={{ x: 1540, y: 0, width: 1440, height: 1000 }}
      />
      <RouteStoryboard
        id="formulario"
        name="Formulario de demostración"
        route="/solicitar"
        layout={{ x: 3080, y: 0, width: 1440, height: 900 }}
      />
      <RouteStoryboard
        id="movil-hero"
        name="Móvil · hero"
        route="/"
        layout={{ x: 4620, y: 0, width: 390, height: 844 }}
      />
      <RouteStoryboard
        id="movil-demo"
        name="Móvil · demo"
        route="/demo"
        layout={{ x: 5110, y: 0, width: 390, height: 844 }}
      />
      <RouteStoryboard
        id="seccion-bucle"
        name="4 · El bucle"
        route="/?seccion=producto"
        layout={{ x: 0, y: 1200, width: 1440, height: 1000 }}
      />
      <RouteStoryboard
        id="seccion-tesis"
        name="3 · Tesis"
        route="/?seccion=tesis"
        layout={{ x: 1540, y: 1200, width: 1440, height: 1000 }}
      />
      <RouteStoryboard
        id="seccion-capacidades"
        name="5 · Qué hace Solaris"
        route="/?seccion=capacidades"
        layout={{ x: 3080, y: 1200, width: 1440, height: 1000 }}
      />
      <RouteStoryboard
        id="seccion-cifra"
        name="6 · La cifra"
        route="/?seccion=cifra"
        layout={{ x: 4620, y: 1200, width: 1440, height: 1000 }}
      />
      <RouteStoryboard
        id="seccion-packs"
        name="8 · Packs"
        route="/?seccion=packs"
        layout={{ x: 0, y: 2300, width: 1440, height: 1000 }}
      />
      <RouteStoryboard
        id="seccion-empezar"
        name="9 · Dos formas de empezar"
        route="/?seccion=empezar"
        layout={{ x: 1540, y: 2300, width: 1440, height: 1000 }}
      />
      <RouteStoryboard
        id="seccion-como-trabajamos"
        name="10–11 · Cómo trabajamos y diario"
        route="/?seccion=como-trabajamos"
        layout={{ x: 3080, y: 2300, width: 1440, height: 1000 }}
      />
      <RouteStoryboard
        id="seccion-preguntas"
        name="12 · Preguntas"
        route="/?seccion=preguntas"
        layout={{ x: 4620, y: 2300, width: 1440, height: 1000 }}
      />
      <RouteStoryboard
        id="seccion-cierre"
        name="13 · Cierre y pie"
        route="/?seccion=cierre"
        layout={{ x: 0, y: 3400, width: 1440, height: 1000 }}
      />
    </Canvas>
  );
}
