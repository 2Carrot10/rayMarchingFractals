#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform vec3 playerRotation;
uniform vec3 orig;
uniform float time;

float nearDist = 0.0;
float farDist = 300.0;


struct ls {
	vec3 pos;
	vec3 color;
	float power;
};

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
	vec3 a = vec3(0.0,0.0,0.0);
	float firstLoopDist = 20.0;
	float loopDist = time * 2.0;

	// space warping
	vec3 newPos2 = mod(orig, loopDist) - vec3(loopDist / 2.0);

	//vec3 newPos2 = newPos / dot(orig, vec3(0.0,1.0,0.0));

	vec3 inter = abs(newPos2 - a);
	float dist = max(inter.x, max(inter.y, inter.z));//(inter.x) * ((inter.y)*( inter.z));
	return dist - 1.0;//9.0 - dist;
}

float hollowCubes(vec3 orig) {
	vec3 a = vec3(0.0,0.0,0.0);
	float firstLoopDist = 20.0;
	float loopDist = time * 2.0;

	// space warping
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


float circlesOfCircles(vec3 orig) {
	vec3 a = vec3(0.0,0.0,0.0);
	float firstLoopDist = 20.0;
	float loopDist = 2.0;

	// space warping
	vec3 newPos2 = mod(orig, loopDist) - vec3(loopDist / 2.0);

	//vec3 newPos2 = newPos / dot(orig, vec3(0.0,1.0,0.0));

	vec3 inter = abs(newPos2 - a);
	float dist = length(inter);//(inter.x) * ((inter.y)*( inter.z));
	//return dist - pow(length(orig),time/3.0)/50000.0;//9.0 - dist;
	return dist - pow(length(orig),6.0)/50000.0;//9.0 - dist;
}

vec3 cast_ray_circle(vec3 orig, vec3 dir) {
	float closeSoFar = 1000.0;

	float totalMove = 0.0;
	for(int j = 0; j < 60; j++){
		float step = circlesOfCircles(orig);
		totalMove += step;
		orig += dir * step;
	}

	float r = (12.0 - totalMove) / ((12.0));
	float g = (6.0 - totalMove) / 6.0;//((farDist/30.0) - totalMove) / ((farDist / 3.0));
	float b = (6.0 - totalMove) / 6.0;//((farDist*2.0/3.0) - totalMove) / ((farDist /3.0));
	// Most are 300, some at the very ends are 0

	return vec3(r, g, b);
}

float crazyMarch(vec3 orig) {
	vec3 a = vec3(0.0,0.0,0.0);
	float firstLoopDist = 20.0;
	float loopDist = 10.0;

	// space warping
	vec3 newPos2 = mod(orig, loopDist) - vec3(loopDist / 2.0);

	//vec3 newPos2 = newPos / dot(orig, vec3(0.0,1.0,0.0));

	vec3 inter = abs(newPos2 - a);
	float dist = (inter.x) * ((inter.y)*( inter.z));
	return dist - 1.0;
}

vec3 cast_ray(vec3 orig, vec3 dir) {
	float closeSoFar = 1000.0;

	float totalMove = 0.0;
	for(int j = 0; j < 60; j++){
		float step = cubes(orig);
		totalMove += step;
		orig += dir * step;
	}

	float r = (farDist - totalMove) / ((farDist / 3.0));
	float g = (160.0 - totalMove) / 160.0;//((farDist/30.0) - totalMove) / ((farDist / 3.0));
	float b = (6.0 - totalMove) / 6.0;//((farDist*2.0/3.0) - totalMove) / ((farDist /3.0));
	// Most are 300, some at the very ends are 0

	return vec3(r, g, b);
}


void main()
{
	//lights[0].pos = vec3(-7.0, .0, 0.7);
	//lights[0].color = vec3(.1, 0.1, 1.);
	//lights[0].power = 1.0;

	float x = (gl_FragCoord.x / (u_resolution.y  + 1.0)) - 0.5; 
	float y = (gl_FragCoord.y / (u_resolution.y  + 1.0)) - 0.5;
	//float y = (gl_FragCoord.y / (u_resolution.y  + 1.0)) - 0.5;

	vec3 dir3 = normalize(vec3(x, y, 1.0));
	vec3 dir = vec3(dir3.x, dir3.y * cos(playerRotation.y) - dir3.z * sin(playerRotation.y), dir3.z * cos(playerRotation.y) + dir3.y * sin(playerRotation.y));
	vec3 dir2 = vec3(dir.x * cos(playerRotation.x) - dir.z * sin(playerRotation.x), dir.y, dir.z * cos(playerRotation.x) + dir.x * sin(playerRotation.x));

	gl_FragColor = vec4(max(cast_ray(orig, dir2),vec3(0.0)),1.0);
}
