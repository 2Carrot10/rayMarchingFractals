#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform vec3 eRot;
uniform vec3 orig;
vec3 lightsource = vec3(0.0, -1.0, 0.7);

struct ob {
	int type;
// For spheres (type 0)	
	vec3 pos;
	vec3 color;
	float radius;

	//For planes (type 1)
	vec3 normal;
	float d; //Distance along the normal?
};

const int obCount = 5;
ob objs[obCount];
/*
float ray_intersect_plane(vec3 R_o, vec3 R_d, plane obj){
	//a = dot(obj.normal, R_d);
	//if(a == 0.0) return -1;
	return -(obj.d + dot(obj.normal, R_o)) / dot(obj.normal, R_d);
}*/


float ray_intersect(vec3 R_o, vec3 R_d, ob obj) {
	if(obj.type == 1) {
		return -(obj.d + dot(obj.normal, R_o)) / dot(obj.normal, R_d);
	}
	float t = dot(obj.pos - R_o, R_d);
	vec3 p = R_o + R_d * t;
	float y = length(obj.pos - p);
	if(y>obj.radius){
		return -1.0;
	}
	return t;
}

vec3 get_norm(vec3 R_o, vec3 R_d, ob obj) {
	if(obj.type == 1) {
		return obj.normal;
	}
	else {

	return normalize((ray_intersect(R_o, R_d, obj) * R_d) - obj.pos);
	}
}


vec3 cast_ray(vec3 orig, vec3 dir) {
	vec3 color;
	float closeSoFar = 100.0;

	vec3 colorSoFar = vec3(0.2471, 0.8784, 1.00);
	for(int i= 0; i < obCount; i++){
		float dist = ray_intersect(orig, dir, objs[i]);
		if (dist > 0.0) {
			if(dist < closeSoFar) {
				vec3 hitPoint = dist * dir;
				colorSoFar = objs[i].color * dot(get_norm(orig, dir, objs[i]), lightsource - hitPoint);
				closeSoFar = dist;
			}
		}
	}
	return colorSoFar;
}


void main()
{
	objs[0].normal = vec3(0.0, 0.0, 1.0);
	objs[0].d = 2.0;
	objs[0].color = vec3(.5,0,.5);
	objs[0].type = 1;

	objs[1].normal = vec3(0.0, 0.0, 1.0);
	objs[1].d = -2.0;
	objs[1].color = vec3(.5,.5,.5);
	objs[1].type = 1;

	objs[2].normal = vec3(0.0, 1.0, 0.0);
	objs[2].d = 2.0;
	objs[2].color = vec3(.0,.0,.0);
	objs[2].type = 1;

	objs[3].pos = vec3(0.0, 0.0, -1.0);
	objs[3].radius = 0.4;
	objs[3].color = vec3(1,0,0);
	objs[3].type = 0;


	objs[4].pos = vec3(0.0, 0.0, 1.0);
	objs[4].radius = .2;
	objs[4].color = vec3(1,1,0);
	objs[4].type = 0;

	float fov = 90.0;
	 //float x = (2.0 *((gl_FragCoord.x   + 0.5)/(u_resolution.x  + 1.0)- 0.5)) * tan(90.0/2.0) * u_resolution.x/u_resolution.y;
	 //float y =  -(2.0*((gl_FragCoord.y + 0.5)/(u_resolution.y - 1.5) - 0.5))*tan(90.0/2.0);
	float x  = (gl_FragCoord.x / (u_resolution.x  + 1.0))- 0.5; 
	float y = (gl_FragCoord.y/(u_resolution.y  + 1.0))- 0.5;

	vec3 dir = normalize(vec3(x, y, 1.0));
	vec3 dir2 = vec3(dir.x * cos(eRot.x) - dir.z * sin(eRot.x), dir.y, dir.z * cos(eRot.x) + dir.x * sin(eRot.x));

	gl_FragColor = vec4(cast_ray(orig, dir2),1.0);
}
