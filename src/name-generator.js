/**
 * @author Yoann Pigné <yoann.pigne@univ-lehavre.fr>
 * @since 2017-11-18
 * 
 * Génère des noms avec adjectifs aléatoires dans le style des noms de distributions Ubuntu.
 */

import isDef from './is-def'

var nouns = ['Circle', 'Cone', 'Cylinder', 'Ellipse', 'Hexagon', 'Irregular Shape', 'Octagon', 'Oval', 'Parallelogram', 'Pentagon', 'Pyramid', 'Rectangle', 'Semicircle', 'Sphere', 'Square', 'Star', 'Trapezoid', 'Triangle', 'Wedge', 'Whorl'];
var adjectives = ['Amusing', 'Athletic', 'Beautiful', 'Brave', 'Careless', 'Clever', 'Crafty', 'Creative', 'Cute', 'Dependable', 'Energetic', 'Famous', 'Friendly', 'Graceful', 'Helpful', 'Humble', 'Inconsiderate', 'Likable', 'Middle Class', 'Outgoing', 'Poor', 'Practical', 'Rich', 'Sad', 'Skinny', 'Successful', 'Thin', 'Ugly', 'Wealth'];
var colors = ['3FFFA2', 'E8DD39', 'FF864C', 'B439E8', 'AAE7FF', 'DC68FF', '5FB8E8', '8BFF75', 'E8C05F', 'FFD3D4', 'FFCA3A', 'E83935', '6147FF', '35E8B6', 'FCFFA5'];

export default (random) => {
    random = isDef(random) ? random : Math.random;
    return  adjectives[Math.floor(Math.random() * adjectives.length)] 
            + ' ' 
            + nouns[Math.floor(Math.random() * nouns.length)]
            + ' '
            + '#' + colors[Math.floor(Math.random() * colors.length)];
}
