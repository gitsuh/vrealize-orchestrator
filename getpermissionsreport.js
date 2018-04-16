// vRO scriptable task
//
// gets permissions for all vcenter objects, dumps them to csv
// 
// Tested on vRO 7.3.0.5481809 build 5481809
// Tested on vRO 7.3.0.6669152 build 6669152
// Tested against VMware vCenter Server 6.0.0 build-3634794
// Tested against VMware vCenter Server 5.5.0 build-1476327
// Tested against VMware vCenter Server 5.5.0 build-2183111
// Tested against VMware vCenter Server 5.5.0 build-2442329
// Tested against VMware vCenter Server 5.5.0 build-7460778
//
// todo: needs clean up
System.log("Gathering SDKs");
var vimhosts = VcPlugin.allSdkConnections;
var alldatacenterfolders = null;
var perm = null;
var reportarray = new Array();


function buildcsv(array){
	
	var timenumber = new Date();
		

	var vroTempFileName = "tempreport-" + (timenumber.getTime()) + ".csv";
	var tempDir = System.getTempDirectory();
	System.log("Temp dir: " + tempDir);
	vroTempFileFullPath = tempDir + "/" + vroTempFileName;
	var writer;
	writer = new FileWriter(vroTempFileFullPath);
	writer.open();
	writer.write("vcenter,parent,entitytype,entityname,group,principal,propagate,role,dynamictype,dynamicproperty\n");
	for(var i = 0; i < array.length; i++){
		writer.write(reportarray[i][0] + "," + reportarray[i][1] + "," + reportarray[i][2] + "," + reportarray[i][3] + "," + reportarray[i][4] + "," + reportarray[i][5] + "," +  reportarray[i][6] + "," + reportarray[i][7] + "," + reportarray[i][8] + "," + reportarray[i][9] + "\n");
	}
//	writer.write(fileContents);
	writer.close();
}

function loadarray(inputdatacenter,inputroles,inputobjects){
	//System.log(inputobjects.getType());
	System.log("Processing object with " + inputobjects.length + " elements");
	for(var j = 0; j < inputobjects.length; j++){
//		System.log("Processing object: " + inputobjects[j].name + " of type " + inputobjects[j].type);
		var object = inputobjects[j];
		var perms = object.permission;
//		System.log("How many perms: " + perms.length);
		for(var k = 0; k < perms.length;k++){
			var newarr = new Array();
			newarr[0] = inputdatacenter;
			var parent = perms[k].entity.parent;
			if (parent != null){
				newarr[1] = parent.name;
			}else{
				newarr[1] = null;
			}
			newarr[2] = perms[k].entity.type
			newarr[3] = perms[k].entity.name
			newarr[4] = perms[k].group
			newarr[5] = perms[k].principal
			newarr[6] = perms[k].propagate
			var rolename = null;
			for(var l = 0; l < inputroles.length; l++){
				if(inputroles[l].roleId == perms[k].roleId){
					rolename = inputroles[l].name
				}
			}
			if (rolename == null){
				newarr[7] = null;
			}else{
				newarr[7] = rolename;
			}
			newarr[8] = perms[k].dynamicType
			newarr[9] = perms[k].dynamicProperty
			reportarray.push(newarr);
		}
	}
}
System.log(vimhosts.length + " vimhosts have been retrieved.");
for(var i = 0; i < vimhosts.length; i++){
	var name = vimhosts[i].name

	var authmanager = vimhosts[i].authorizationManager;
	var allroles = authmanager.roleList;
	System.log(" Roles:" + allroles.length);
	var AllClusterComputeResources = vimhosts[i].getAllClusterComputeResources();
	System.log(AllClusterComputeResources.length + " AllClusterComputeResources  have been retrieved.");
	var AllComputeResources = vimhosts[i].getAllComputeResources();
	System.log(AllComputeResources.length + " AllComputeResources have been retrieved.");
	var AllDatacenterFolders = vimhosts[i].getAllDatacenterFolders();
	System.log(AllDatacenterFolders.length + " AllDatacenterFolders have been retrieved.");
	var AllDatacenters = vimhosts[i].getAllDatacenters();
	System.log(AllDatacenters.length + " AllDatacenters have been retrieved.");
	var AllDatastoreFolders = vimhosts[i].getAllDatastoreFolders();
	System.log(AllDatastoreFolders.length + " AllDatastoreFolders have been retrieved.");
	var AllDatastores = vimhosts[i].getAllDatastores();
	System.log(AllDatastores.length + " AllDatastores have been retrieved.");
	var AllDistributedVirtualPortgroups = vimhosts[i].getAllDistributedVirtualPortgroups();
	System.log(AllDistributedVirtualPortgroups.length + " AllDistributedVirtualPortgroups have been retrieved.");
	var AllHostFolders = vimhosts[i].getAllHostFolders();
	System.log(AllHostFolders.length + " AllHostFolders have been retrieved.");
	var AllNetworkFolders = vimhosts[i].getAllNetworkFolders();
	System.log(AllNetworkFolders.length + " AllNetworkFolders have been retrieved.");
	var AllNetworks = vimhosts[i].getAllNetworks();
	System.log(AllNetworks.length + " AllNetworks have been retrieved.");
	var AllResourcePools = vimhosts[i].getAllResourcePools();
	System.log(AllResourcePools.length + " AllResourcePools have been retrieved.");
	var AllVirtualMachines = vimhosts[i].getAllVirtualMachines();
	System.log(AllVirtualMachines.length + " AllVirtualMachines have been retrieved.");
	var AllVmFolders = vimhosts[i].getAllVmFolders();
	System.log(AllVmFolders.length + " AllVmFolders have been retrieved.");

	loadarray(name,allroles,AllClusterComputeResources);
	loadarray(name,allroles,AllComputeResources);
	loadarray(name,allroles,AllDatacenterFolders);
	loadarray(name,allroles,AllDatacenters);
	loadarray(name,allroles,AllDatastoreFolders);
	loadarray(name,allroles,AllDatastores);
	loadarray(name,allroles,AllDistributedVirtualPortgroups);
	loadarray(name,allroles,AllHostFolders);
	loadarray(name,allroles,AllNetworkFolders);
	loadarray(name,allroles,AllNetworks);
	loadarray(name,allroles,AllResourcePools);
	loadarray(name,allroles,AllVirtualMachines);
	loadarray(name,allroles,AllVmFolders);

	
	
	
	
}
System.log("Reporting..." + reportarray.length);
var line = "";
for (var i = 0; i < reportarray.length; i++){
	System.log(reportarray[i][0] + " | " + reportarray[i][1] + " | " + reportarray[i][2] + " | " + 
               reportarray[i][3] + " | " + reportarray[i][4] + " | " + reportarray[i][5] + " | " + 
			   reportarray[i][6] + " | " + reportarray[i][7] + " | " + reportarray[i][8] + " | " +
			   reportarray[i][9]);

}

buildcsv(reportarray);
