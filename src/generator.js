import * as THREE from 'three';

var SimplexNoise = require('simplex-noise');
var simplex = new SimplexNoise();


export default class Planet {
    
    _seed;
    _vertices;
    _faces;
    _index = 0;
    terrain = new Array();
    _meshes;
    _palette;
    

    constructor(data)
    {  
        this._vertices = new Array();
        this._faces = new Array();
        this._seed = data.seed;
        this.simplex = new SimplexNoise(this._seed);
        this._meshes = new Array();
        this._palette = new Array(15);
        this._heightOffset = data.height;
        this._seaLevelOffset = data.ocean;
        this._heightOffset = .05;
        this._seaLevelOffset = 0.01;
        console.log(data.height);
    }

    generate(scene, recursionLevel)
    {
        // create 12 vertices of a icosahedron
    
        var t = (1.0 + Math.sqrt(5.0)) / 2.0;

        this.addVertex(new THREE.Vector3(-1,  t,  0));
        this.addVertex(new THREE.Vector3( 1,  t,  0));
        this.addVertex(new THREE.Vector3(-1, -t,  0));
        this.addVertex(new THREE.Vector3( 1, -t,  0));

        this.addVertex(new THREE.Vector3( 0, -1,  t));
        this.addVertex(new THREE.Vector3( 0,  1,  t));
        this.addVertex(new THREE.Vector3( 0, -1, -t));
        this.addVertex(new THREE.Vector3( 0,  1, -t));

        this.addVertex(new THREE.Vector3( t,  0, -1));
        this.addVertex(new THREE.Vector3( t,  0,  1));
        this.addVertex(new THREE.Vector3(-t,  0, -1));
        this.addVertex(new THREE.Vector3(-t,  0,  1));

        // 5 faces around point 0
        this._faces.push(new THREE.Vector3(0, 11, 5));
        this._faces.push(new THREE.Vector3(0, 5, 1));
        this._faces.push(new THREE.Vector3(0, 1, 7));
        this._faces.push(new THREE.Vector3(0, 7, 10));
        this._faces.push(new THREE.Vector3(0, 10, 11));

        // 5 adjacent faces 
        this._faces.push(new THREE.Vector3(1, 5, 9));
        this._faces.push(new THREE.Vector3(5, 11, 4));
        this._faces.push(new THREE.Vector3(11, 10, 2));
        this._faces.push(new THREE.Vector3(10, 7, 6));
        this._faces.push(new THREE.Vector3(7, 1, 8));

        // 5 faces around point 3
        this._faces.push(new THREE.Vector3(3, 9, 4));
        this._faces.push(new THREE.Vector3(3, 4, 2));
        this._faces.push(new THREE.Vector3(3, 2, 6));
        this._faces.push(new THREE.Vector3(3, 6, 8));
        this._faces.push(new THREE.Vector3(3, 8, 9));

        // 5 adjacent faces 
        this._faces.push(new THREE.Vector3(4, 9, 5));
        this._faces.push(new THREE.Vector3(2, 4, 11));
        this._faces.push(new THREE.Vector3(6, 2, 10));
        this._faces.push(new THREE.Vector3(8, 6, 7));
        this._faces.push(new THREE.Vector3(9, 8, 1));

        // refine triangles
        for (let i = 0; i < recursionLevel; i++)
        {
            var faces2 = new Array();

            for (let j = 0; j < this._faces.length; j++)
            {
                // replace triangle by 4 triangles
                var a = this.getMiddlePoint(this._faces[j].x, this._faces[j].y);
                var b = this.getMiddlePoint(this._faces[j].y, this._faces[j].z);
                var c = this.getMiddlePoint(this._faces[j].z, this._faces[j].x);

                faces2.push(new THREE.Vector3(this._faces[j].x, a, c));
                faces2.push(new THREE.Vector3(this._faces[j].y, b, a));
                faces2.push(new THREE.Vector3(this._faces[j].z, c, b));
                faces2.push(new THREE.Vector3(a, b, c));
                
            }
                
            this._faces = faces2;
        }

        /*
        // done, now add triangles to mesh
        for (let i = 0; i < this._faces.length; i++)
        {
            this._vertices.push(new THREE.Vector3(this._faces[i].x, this._faces[i].y, this._faces[i].z));
        }
        */
        
        
        /*
        var vertex = new Array();
        for (let i = 0; i < this._vertices.length; i++) {
            var temp = new Array();
            
            var x = this._vertices[i].x;
            var y = this._vertices[i].y;
            var z = this._vertices[i].z;
            temp.push(x);
            temp.push(y);
            temp.push(z);

            vertex.push(temp);
            
        }*/

        var faceColors = new Array();
        for (let i = 0; i < this._vertices.length; i+=3)
        {
            
            var noiseMap = new Array(3);

            for (let j = 0; j < 3; j++)
            {
                var vertex = this._vertices[i + j];

                var actualNoiseValue = simplex.noise3D(vertex.x, vertex.y, vertex.z);
                var noiseValue = actualNoiseValue;

                noiseMap[j] = (actualNoiseValue < 0) ? actualNoiseValue : 0;

                this._vertices[i + j] = vertex.multiplyByFloats((1.0 + this._seaLevelOffset + noiseValue * this._heightOffset), (1.0 + this._seaLevelOffset  + noiseValue * this._heightOffset), (1.0 + this._seaLevelOffset  + noiseValue * this._heightOffset));
                //faceColors[i+j] = (actualNoiseValue < .5) ? new THREE.Color3(0, 1, 0) : new THREE.Color3(.05, .1, 1);
                
            }
            
            
        }

        var face = new Array();
        for (let i = 0; i < this._faces.length; i++) {
            var temp = new Array();
            temp.push(this._faces[i].x);
            temp.push(this._faces[i].y);
            temp.push(this._faces[i].z);

            face.push(temp);
        }

        var vertexArr = new Array();
        for (let i = 0; i < this._vertices.length; i++) {
            var temp = new Array();
            
            var x = this._vertices[i].x;
            var y = this._vertices[i].y;
            var z = this._vertices[i].z;
            temp.push(x);
            temp.push(y);
            temp.push(z);

            vertexArr.push(temp);
            
        }

        // https://stackoverflow.com/questions/22845995/three-js-how-can-i-calculate-the-distance-between-two-3d-positions#22846762
        function distanceVector( v1, v2 )
        {
            var dx = v1.x - v2.x;
            var dy = v1.y - v2.y;
            var dz = v1.z - v2.z;

            return Math.sqrt( dx * dx + dy * dy + dz * dz );        
        }

        for (let i = 0; i < this._faces.length; i++) {
            var v1 = this._vertices[this._faces[i].x];
            var v2 = this._vertices[this._faces[i].y];
            var v3 = this._vertices[this._faces[i].z];
            var center = new THREE.Vector3((v1.x + v2.x +v3.x)*(1/3), (v1.y + v2.y +v3.y)*(1/3), (v1.z + v2.z +v3.z)*(1/3));
            var centerDistance = distanceVector(center, new THREE.Vector3(0, 0, 0));

            if(centerDistance > 1+(9*(this._heightOffset/10))) //peaks
            {
                faceColors[i] = this._palette[0];
            }
            else if(centerDistance > 1+(8*(this._heightOffset/10))) //plains
            {
                faceColors[i] = this._palette[1];
            }
            else if(centerDistance > 1+(7*(this._heightOffset/10))) //plains
            {
                faceColors[i] = this._palette[2];
            }
            else if(centerDistance > 1+(6*(this._heightOffset/10))) //plains
            {
                faceColors[i] = this._palette[2];
            }
            else if(centerDistance > 1+(5*(this._heightOffset/10))) //plains
            {
                faceColors[i] = this._palette[3];
            }
            else if(centerDistance > 1+(3*(this._heightOffset/10))) //mountians
            {
                faceColors[i] = this._palette[4];
            }
            else if(centerDistance > 1+(2*(this._heightOffset/10))) //plains
            {
                faceColors[i] = this._palette[5];
            }
            else if(centerDistance > 1+(this._heightOffset/10)) // coastal
            {
                faceColors[i] = this._palette[6];
            }
            else if(centerDistance > 1-(2*(this._heightOffset/10))) //plains
            {
                faceColors[i] = this._palette[7];
            }
            else if(centerDistance > 1-(3*(this._heightOffset/10))) //plains
            {
                faceColors[i] = this._palette[8];
            }
            else if(centerDistance > 1-(4*(this._heightOffset/10))) //plains
            {
                faceColors[i] = this._palette[9];
            }
            else if(centerDistance > 1-(5*(this._heightOffset/10))) //plains
            {
                faceColors[i] = this._palette[10];
            }
            else if(centerDistance > 1-(6*(this._heightOffset/10))) //plains
            {
                faceColors[i] = this._palette[11];
            }
            else if(centerDistance > 1-(7*(this._heightOffset/10))) //plains
            {
                faceColors[i] = this._palette[12];
            }
            else
            { 
                faceColors[i] = this._palette[13];
            }
            //console.log(THREE.Vector3.Distance(this._vertices[i], THREE.Vector3.Zero()));

        }
        
        


        const ico = { "name":"Planet", "category":["Prism"], "vertex":vertexArr,
        "face":face};

        var planetMaterial = new THREE.MeshStandardMaterial("planetMaterial", scene);
        planetMaterial.emissiveColor = new THREE.Color3(.15, .15, .15)
        planetMaterial.diffuseColor = new THREE.Color3(1, 1, 1);
        planetMaterial.specularColor = new THREE.Color3(.01, .01, .01);
        //planetMaterial.ambientColor = new THREE.Color3(1, 1, 1);

        //THREE.MeshBuilder.CreateIcoSphere("h", {}, scene);
        this._meshes[0] = new THREE.Mesh("PlanetMesh", {custom: ico, faceColors: faceColors, updatable:true, sideOrientation:THREE.Mesh.DOUBLESIDE}, scene); //scene is optional and defaults to the current scene 
        this._meshes[0].material = planetMaterial;

        //var water = THREE.MeshBuilder.CreateIcoSphere("bedrock", {radius:1.002, subdivisions:20, updatable:true}, scene);
        //water.hasVertexAlpha = true;
        //water.visibility = 0.4;

        
        this._scene = scene;
        //console.log(this._faces.length);


    }

    generateAtmosphere(colorRGB)
    {
        
        this._meshes[1] = THREE.MeshBuilder.CreateIcoSphere("atmosphere0", {radius:1.05, subdivisions:20, updatable:true, sideOrientation:THREE.Mesh.DOUBLESIDE}, this._scene);
        this._meshes[1].hasVertexAlpha = true;
        this._meshes[1].visibility = 0.05;

        var atmosphereMaterial = new THREE.StandardMaterial("oceanMaterial", this._scene);
        atmosphereMaterial.diffuseColor = new THREE.Color3(colorRGB["r"]/255, colorRGB["g"]/255, colorRGB["b"]/255);

        this._meshes[1].material = atmosphereMaterial;

    }

    generateOcean(colorRGB)
    {
        var color = new THREE.Color3(colorRGB["r"]/255, colorRGB["g"]/255, colorRGB["b"]/255);
        this._meshes[2] = THREE.MeshBuilder.CreateIcoSphere("ocean", {radius:1, subdivisions:12, updatable:true}, this._scene);
        this._meshes[2].hasVertexAlpha = true;
        this._meshes[2].visibility = 0.8;

        var oceanMaterial = new THREE.StandardMaterial("oceanMaterial", this._scene);
        if(colorRGB["luminosity"]>0)
        { 
            //oceanMaterial.ambientColor = color;
            oceanMaterial.diffuseColor = color;
            oceanMaterial.emissiveColor = color;
            oceanMaterial.specularColor = new THREE.Color3(0,0,0);
            /*var light = new THREE.PointLight("pointLight", new THREE.Vector3(0, 0, 0), this._scene);
            light.intensity = 100;*/
        }
        else
        {
            oceanMaterial.diffuseColor = color;
        }
        


        this._meshes[2].material = oceanMaterial;
    }

    subdivideDebug(depth, id)
    {
        var positions = this._meshes[0].getVerticesData(THREE.VertexBuffer.PositionKind);
        //var normals = this._meshes[0].getVerticesData(THREE.VertexBuffer.NormalKind);
        var colors = this._meshes[0].getVerticesData(THREE.VertexBuffer.ColorKind);

        var subMeshPositions = new Array();
        var subMeshColors = new Array();

        depth = Math.pow(4, depth);

        //var colors = new Array();
        var indices = this._meshes[0].getIndices();

        console.log(colors);
        console.log(indices);
        if(positions != null && colors!=null) //TypeScript doesnt like me
        {
            var colorIndex = (4)*id*(positions.length/3)/(20*depth);   // (amout of numbers for color) * (subchunk number) * (amount of tris in each subchunk)
            var posIndex = 3*id*(positions.length/3)/(20*depth);

            for(var p = 0; p < ((positions.length/3)/(20*depth)); p++) {  //iterate through each vertex in subchunk
                
                positions.slice()
                colors[colorIndex] = .4;
                colors[colorIndex+1] = 1;
                colors[colorIndex+2] = 0;
                colors[colorIndex+3] = 0;
                colorIndex+=4;


            } 
            this._meshes[0].updateVerticesData(THREE.VertexBuffer.ColorKind, colors);
            console.log(colors);
        }

        else{
            console.log("Null!");
        }
        

    }

    /*

    subdivide(depth: number)
    {
        var positions = this._meshes[0].getVerticesData(THREE.VertexBuffer.PositionKind);
        var normals = this._meshes[0].getVerticesData(THREE.VertexBuffer.NormalKind);
        var colors = this._meshes[0].getVerticesData(THREE.VertexBuffer.ColorKind);

        var subMeshPositions = new Array();
        var subMeshColors = new Array();

        depth = Math.pow(4, depth);

        //var colors = new Array();
        var indices = this._meshes[0].getIndices();

        console.log(colors);
        console.log(indices);
        if(positions != null && colors!=null) //TypeScript doesnt like me
        {
            var colorIndex = 0;   // (amout of numbers for color) * (subchunk number) * (amount of tris in each subchunk)
            var posIndex = 0;
        
            for(var i = 0; i < (20*depth); i++) //for each subchunk
            {
                new THREE.SubMesh(i, )
            }
            this._meshes[0].updateVerticesData(THREE.VertexBuffer.ColorKind, colors);
            console.log(colors);
        }

        else{
            console.log("Null!");
        }

    }

    */


    generatePalette(color)
    {
        this._palette[0] = new THREE.Color4(color["r"]/255, color["g"]/255, color["b"]/255, 1);
        for (let i = 1; i < this._palette.length; i++) {
            var newColor = new THREE.Color4(0, 0, 0, 1);
            newColor.r = (color["r"]/255) - (i * .05 * (color["r"]/255));
            newColor.g = (color["g"]/255) - (i * .05 * (color["g"]/255));
            newColor.b = (color["b"]/255) - (i * .05 * (color["b"]/255));

            this._palette[i] = newColor;
        }
        
    }

    setPalette(palette)
    {
        this._palette = palette;
    }

    

    scaleMesh(scale)
    {
        for (let i = 0; i < this._meshes.length; i++) {
            this._meshes[i].scaling = (new THREE.Vector3(scale, scale, scale));
        }
    }

    translate(pos)
    {
        console.log(this._meshes[0].name);
        for (let i = 0; i < this._meshes.length; i++) {
            
            this._meshes[i].position = pos;
        }
    }


    addVertex(p)
    {
        const length = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
        this._vertices.push(new THREE.Vector3(p.x/length, p.y/length, p.z/length));
        return this._index++;
    }

    // return index of point in the middle of p1 and p2
    getMiddlePoint(p1, p2)
    {
        // not in cache, calculate it
        var point1 = this._vertices[p1];
        var point2 = this._vertices[p2];
        var middle = new THREE.Vector3(
            (point1.x + point2.x) / 2.0, 
            (point1.y + point2.y) / 2.0, 
            (point1.z + point2.z) / 2.0);

        // add vertex makes sure point is on unit sphere
        var i = this.addVertex(middle); 


        return i;
    }
}