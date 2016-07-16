precision mediump float;
uniform float time;
varying vec2 vUv;
varying vec2 v_texCoord;

const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

float noise( in vec2 x )
{
    return sin(1.5*x.x)*sin(1.5*x.y);
}

float fbm4( vec2 p )
{
    float f = 0.0;
    f += 0.5000*noise( p ); p = m*p*2.02;
    f += 0.2500*noise( p ); p = m*p*2.03;
    f += 0.1250*noise( p ); p = m*p*2.01;
    f += 0.0625*noise( p );
    return f/0.9375;
}
                            
float fbm(vec2 vUv){
        float f = (sin(time/1000.) );
        f += 0.500000*(0.5+0.5*noise( vUv )); vUv = m*vUv*2.02;
        f += 0.250000*(0.5+0.5*noise( vUv )); vUv = m*vUv*2.03;
        f += 0.125000*(0.5+0.5*noise( vUv )); vUv = m*vUv*2.01;
        f += 0.062500*(0.5+0.5*noise( vUv )); vUv = m*vUv*2.04;
        f += 0.031250*(0.5+0.5*noise( vUv )); vUv = m*vUv*2.05;
        f += 0.015625*(0.5+0.5*noise( vUv )); //vUv =  m*vUv*2.06;
        //f += 0.0078125*(0.5+0.5*noise( vUv )); vUv =  m*vUv*2.07;
        //f += 0.00390625*(0.5+0.5*noise( vUv )); 
        return f/0.96875; 
 }

float pattern( in vec2 vUv )
{
    vec2 q = vec2( fbm( vUv + vec2(0.0,0.0) ),
                    fbm( vUv + vec2(5.2,1.3) ) );

    vec2 r = vec2( fbm( vUv + 4.0*q + vec2(1.7,9.2) ),
                   fbm( vUv + 4.0*q + vec2(8.3,2.8) ) );
      
    return fbm( vUv + 16.0*r );
}

void main(){
    
    //vec2 Uv = mod(vUv, vec2(3.2)) ;
    vec2 q = vUv*0.6;
    vec2 p = -1.0 + 2.0 * q;
    // 0.7176, 0.2549, 0.05
    // gl_FragColor = vec4( 0.7176 , 0.1 + pattern(vec2(pattern(p*sin(time/1000.)), 0.1)), 0.2, 1.0);
    gl_FragColor = vec4(pattern(p*sin(time/750.) + 2000.5 )/2. , (pattern(p*sin(time/750.) + 2000.5) ) /1.5, (pattern(p*sin(time/750.) + 2000.5) + 0.2) /1.8, 1.0);
    //gl_FragColor = vec4( )
}
