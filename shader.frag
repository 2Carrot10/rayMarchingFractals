#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform vec3 playerRotation;
uniform vec3 orig;
uniform float time;
uniform float distort;


float nearDist = 0.0;
float farDist = 300.0;


vec3 nearColor = vec3(0.733,0.604,0.969);
float farColorDist = 30.0;
vec3 farColor = vec3(0.62,0.808,0.416);

float fartherColorDist = 80.0;
vec3 fartherColor = vec3(0.478,0.635,0.969);

float backColorDist = 300.0;
vec3 backColor = vec3(0.102,0.106,0.149);


// Light
struct ls {
	vec3 pos;
	vec3 color;
	float power;
};

int Iterations = 22;
float Scale = 2.0;
float Offset = 3.0;

float DE3(vec3 z)
{

	float loopDist = 6.0;
	z = mod(z, loopDist) - vec3(loopDist / 2.0);
	z/=2.0;
    float r;
    int n = 0;
    while (n < Iterations) {
       if((z.x+z.y)<0.0) z.xy = -z.yx; // fold 1
       if((z.x+z.z)<0.0) z.xz = -z.zx; // fold 2
       if((z.y+z.z)<0.0) z.zy = -z.yz; // fold 3	
       z = z*Scale - Offset*(Scale-1.0);
       n++;
    }
    return (length(z) ) * pow(Scale, -float(n));
}

float DE2(vec3 z)
{
    float r;
    int n = 0;
    while (n < Iterations) {
       if(z.x+z.y<0.0) z.xy = -z.yx; // fold 1
       if(z.x+z.z<0.0) z.xz = -z.zx; // fold 2
       if(z.y+z.z<0.0) z.zy = -z.yz; // fold 3	
       z = z*Scale - Offset*(Scale-1.0);
       n++;
    }
    return (length(z) ) * pow(Scale, -float(n));
}

float DE(vec3 z)
{

	vec3 a1 = vec3(1,1,1);
	vec3 a2 = vec3(-1,-1,1);
	vec3 a3 = vec3(1,-1,-1);
	vec3 a4 = vec3(-1,1,-1);
	vec3 c;
	int n = 0;
	float dist, d;
	while (n < Iterations) {
		 c = a1; dist = length(z-a1);
	        d = length(z-a2); if (d < dist) { c = a2; dist=d; }
		 d = length(z-a3); if (d < dist) { c = a3; dist=d; }
		 d = length(z-a4); if (d < dist) { c = a4; dist=d; }
		z = Scale*z-c*(Scale-1.0);
		n++;
	}

	return length(z) * pow(Scale, float(-n));
}

//wholes
float wholes(vec3 orig) {
	vec3 a = vec3(0.0,0.0,0.0);
	float firstLoopDist = 20.0;
	float loopDist = 10.0;

	// space warping
	vec3 newPos2 = mod(orig, loopDist) - vec3(loopDist / 2.0);

	//vec3 newPos2 = newPos / dot(orig, vec3(0.0,1.0,0.0));

	vec3 inter = abs(newPos2 - a);
	float dist = length(inter);//(inter.x) * ((inter.y)*( inter.z));
	return 7.0 - dist;//9.0 - dist;
}

float cubes(vec3 orig) {
	float loopDist = 6.0;

	// space warping
	vec3 newPos = mod(orig, loopDist) - vec3(loopDist / 2.0);
	orig -= vec3(loopDist / 2.0);
	if(orig.x <= loopDist/2.0) newPos.x = orig.x;

	vec3 inter = abs(newPos);
	float dist = max(inter.x, max(inter.y, inter.z));//(inter.x) * ((inter.y)*( inter.z));
	return (dist - 1.0);//9.0 - dist;
}

float hollowCubes(vec3 orig) {
	vec3 a = vec3(0.0,0.0,0.0);
	float firstLoopDist = 20.0;
	float loopDist = time * 2.0;

	// Space warping
	vec3 newPos2 = mod(orig, loopDist) - vec3(loopDist / 2.0);

	//vec3 newPos2 = newPos / dot(orig, vec3(0.0,1.0,0.0));

	vec3 inter = abs(newPos2 - a);
	float dist = max(inter.x, max(inter.y, inter.z));//(inter.x) * ((inter.y)*( inter.z));)
	float distX = max(inter.x, max(inter.y * 2.0, inter.z * 2.0));//(inter.x) * ((inter.y)*( inter.z));)
	return distX - 1.0;//9.0 - dist;
}

float fractalMaybe(vec3 orig) {
	vec3 a = vec3(0.0,0.0,0.0);
	float firstLoopDist = 20.0;
	float loopDist = 1.0;

	// space warping
	float taxiDist = max(abs(orig.x), max(abs(orig.y), abs(orig.z)));
	float countedDist = (floor( taxiDist/loopDist));
	vec3 newPos2 = mod(orig, loopDist/countedDist) - vec3(loopDist / 2.0);

	//vec3 newPos2 = newPos / dot(orig, vec3(0.0,1.0,0.0));

	vec3 inter = abs(newPos2 - a);
	float dist = max(inter.x, max(inter.y, inter.z));//(inter.x) * ((inter.y)*( inter.z));
	return dist - 1.0;//9.0 - dist;
}

vec3 cast_ray(vec3 orig, vec3 dir, vec3 origdir) {
	float closeSoFar = 1000.0;

  // Move
	float totalMove = 0.0;
	float lowestStep = 100000.0;
	for(int j = 0; j < 100; j++){
		float step = DE2(orig);
    dir = normalize(dir-(origdir*(distort*.1*step)));
    lowestStep = min(lowestStep, step);
    int count = 0;
    orig += step * dir;
    totalMove += step;
	}

  // Set color
	vec3 col = vec3(0);

  col = vec3(sin(totalMove), sin(totalMove/2.0), sin(totalMove/4.0));
  // return col;
	if(totalMove < farColorDist) {
		float a = (totalMove/farColorDist);
		col = farColor * a + nearColor * (1.0-a);
		col = nearColor * (1.0-a) + farColor * a;
	}
	else if (totalMove < fartherColorDist) {
		//float a = //((totalMove - farColorDist)/(fartherColorDist-farColorDist));
		// col = fartherColor * a + farColor * (1.0-a);
	} else {
		col = backColor;
	}
	
  // if(lowestStep < .2) col = vec3(1,col.g,col.b);
	// return col;

	float r = ((farDist*2.0/3.0) - totalMove) / ((farDist / 1.9));
	float g = (160.0 - min(totalMove,160.0)) / 160.0;//((farDist/30.0) - totalMove) / ((farDist / 3.0));
	float b = (farDist - totalMove) / ((farDist * 1.0));
  g=g*g*g;
  float c = 0.0;//sin(totalMove)*.1;
	// Most are 300, some at the very ends are 0

	return vec3(r+c, g+c, b+c);
}


void main()
{
	//lights[0].pos = vec3(-7.0, .0, 0.7);
	//lights[0].color = vec3(.1, 0.1, 1.);
	//lights[0].power = 1.0;

	float x = (gl_FragCoord.x / (u_resolution.y)) - 0.5 * u_resolution.x / u_resolution.y; 
	float y = (gl_FragCoord.y / (u_resolution.y)) - 0.5;
  x=x/((time*4.0)+1.0);
  y=y/((time*4.0)+1.0);
	//float y = (gl_FragCoord.y / (u_resolution.y  + 1.0)) - 0.5;

	vec3 dir3 = normalize(vec3(x, y, 1.0));
	vec3 dir = vec3(dir3.x, dir3.y * cos(playerRotation.y) - dir3.z * sin(playerRotation.y), dir3.z * cos(playerRotation.y) + dir3.y * sin(playerRotation.y));
	vec3 dir2 = vec3(dir.x * cos(playerRotation.x) - dir.z * sin(playerRotation.x), dir.y, dir.z * cos(playerRotation.x) + dir.x * sin(playerRotation.x));



	vec3 adir3 = normalize(vec3(0.0, 0.0, 1.0));
	vec3 adir = vec3(adir3.x, adir3.y * cos(playerRotation.y) - adir3.z * sin(playerRotation.y), adir3.z * cos(playerRotation.y) + adir3.y * sin(playerRotation.y));
	vec3 adir2 = vec3(adir.x * cos(playerRotation.x) - adir.z * sin(playerRotation.x), adir.y, adir.z * cos(playerRotation.x) + adir.x * sin(playerRotation.x));


  float xForward = u_resolution.x/2.0;
  float yForward = u_resolution.y/2.0;

	gl_FragColor = vec4(max(cast_ray(orig, dir2, adir2),vec3(0.0)),1.0);
}
