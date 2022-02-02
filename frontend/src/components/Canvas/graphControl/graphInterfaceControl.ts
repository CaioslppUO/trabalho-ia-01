import { NodeProps, DrawLinkProps } from "../canvasTypes/types";

/**
 * Função responsável por desenhar uma nó na tela
 * @param ctx -> Contexto canvas 2d
 * @param d -> nó que será desenhado
 * @param r -> raio do nó
 */
export function drawNode(ctx: any, d: NodeProps, r: number) {
  ctx.beginPath();
  ctx.fillStyle = d.color;

  ctx.moveTo(d.x, d.y);
  ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "bold 16px Arial";

  ctx.fillText(d.name, d.x + r, d.y - r);
}

/**
 * Função responsável por desenhar um vértice na tela
 * @param ctx -> Contexto canvas 2d
 * @param l -> aresta a ser desenhada
 * @param r  -> raio do nó
 */
export function drawLink(ctx: any, l: DrawLinkProps, r: number) {
  console.log(l);
  ctx.beginPath();
  ctx.strokeStyle = l.color;
  ctx.lineWidth = 3;
  ctx.moveTo(l.source.x, l.source.y);

  var x0 = l.source.x,
    y0 = l.source.y,
    x1 = l.target.x,
    y1 = l.target.y;
  var c = Math.abs(l.target.x - l.source.x);
  var b = Math.abs(l.target.y - l.source.y);

  var vX = x1 - x0;
  var vY = y1 - y0;
  var t = 1 - r / Math.sqrt(b * b + c * c);

  var rX = x0 + t * vX;
  var rY = y0 + t * vY;

  var mX = Math.abs(l.target.x + l.source.x) / 2;
  var mY = Math.abs(l.target.y + l.source.y) / 2;

  mX = Math.abs(l.target.x + mX) / 2;
  mY = Math.abs(l.target.y + mY) / 2;
  ctx.moveTo(l.source.x, l.source.y);

  mX = Math.abs(l.target.x + l.source.x) / 2;
  mY = Math.abs(l.target.y + l.source.y) / 2;

  ctx.moveTo(mX, mY);

  ctx.moveTo(l.source.x, l.source.y);
  canvas_arrow(ctx, l.source.x, l.source.y, rX, rY);

  ctx.stroke();
  ctx.font = "bold 10px Arial";
  ctx.fillStyle = "purple";
  ctx.fillText(
    l.distance,
    Math.abs(l.target.x + l.source.x) / 2 + 10,
    Math.abs(l.target.y + l.source.y) / 2 + 10
  );
}

/**
 * Desenha uma flecha dados os pontos iniciais e finais
 * @param context -> Contexto canvas 2d
 * @param fromx -> x inicial
 * @param fromy -> y inicial
 * @param tox -> x final
 * @param toy -> y final
 */
export function canvas_arrow(
  context: any,
  fromx: any,
  fromy: any,
  tox: any,
  toy: any
) {
  var headlen = 10; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6)
  );
}

/**
 * Função que verifica se existe colisão entro o nó e as paredes do canvas
 * @param v -> Array de nós a serem verificados
 * @param r -> Raio dos nós
 * @param width -> Largura do canvas
 * @param height -> Altura do canvas
 */
export function checkCollision(
  element: NodeProps,
  r: number,
  width: number,
  height: number
) {
  if (element.x - r < 0) {
    element.x = r;
  }

  if (element.y - r < 0) {
    element.y = r;
  }

  if (width && element.x + r > width) {
    element.x = width - r;
  }

  if (height && element.y + r >= height) {
    element.y = height - r;
  }
}

/**
 * Função executada ao iniciar a ação de arrastar um nó
 * @param event event específico da ação
 * @param simulation instância do objeto de simulação
 */
export function onStartDrag(event: any, simulation: any) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

/**
 * Função executada durante a ação de arrastar um nó
 * @param event event específico da ação
 * @param width largura do canvas
 * @param height altura do canvas
 */
export function onDrag(event: any, width: number, height: number) {
  if (event.x > 0 && event.x < width - 5) {
    event.subject.fx = event.x;
  }
  if (event.y > 0 && event.y < height - 5) {
    event.subject.fy = event.y;
  }
}

/**
 * Função executada ao finalizar a ação de arrastar um nó
 * @param event event específico da ação
 * @param simulation instância do objeto de simulação
 */
export function onDragEnd(event: any, simulation: any) {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}
