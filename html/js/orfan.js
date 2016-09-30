$(document).ready(function() {
	loadAndPopulateData();
});

var masonry_obj;

// Loads metalist containing references to all meta data
function loadAndPopulateData() {

	// Fetch global object
	var metas = data["datasets"];

	if (metas == undefined) {
		console.log("metaList object was undefined.");
		return;
	}

	// Hide the template element and apply default values that will be copied into the clones
	$("#example-element").hide();
	$("#example-element .max-view").hide();

	var container = document.getElementById("element-container");
	for (var key in metas) {
		container.appendChild(createElement(key, metas[key]));
	}

	// Remove example element
	$("#example-element").remove();

	// Init external objects

	// Masonry
	masonry_obj = new Masonry('.grid', {
	  // options
	  itemSelector: '.item',
	  columnWidth: 250,
	  gutter: 10
	});

	// layout Masonry after each image loads
	$(masonry_obj).imagesLoaded().progress( function() {
	  masonry_obj.layout();
	});

	// List
	var listObj = new List('body', {
		valueNames: ['title', 'path', 'tag']
	});

	listObj.on("searchComplete", function() {
		masonry_obj.layout();
	})
}


function createElement(key, meta_data) {
	var example = document.getElementById("example-element");
	var elem = example.cloneNode(true);

	var id = key.replace(/\//g, "-");
	id = id.replace(/\\/g, "-");

	// Update id
	elem.id = id;

	// Create default values if none exists
	if (meta_data["name"] == undefined)
		meta_data["name"] = "Undefined";

	if (meta_data["tags"] == undefined)
		meta_data["tags"] = [];

	if (meta_data["thumbnails"] == undefined)
		meta_data["thumbnails"] = [];

	if (meta_data["description"] == undefined)
		meta_data["description"] = "";

	if (meta_data["origin"] == undefined)
		meta_data["origin"] = "";

	if (meta_data["contact"] == undefined)
		meta_data["contact"] = "";

	if (meta_data["license"] == undefined)
		meta_data["license"] = "";

	if (meta_data["notes"] == undefined)
		meta_data["notes"] = "";

	if (meta_data["acknowledgements"] == undefined)
		meta_data["acknowledgements"] = "";

	if (meta_data["citations"] == undefined)
		meta_data["citations"] = [];

	if (meta_data["files"] == undefined)
		meta_data["files"] = [];

	// Update header/title
	$(elem).find(".title").html(meta_data["name"]);

	// Update path
	$(elem).find("#path").html(key);
	$(elem).find(".path-container").html(function() {
		var path_elem = $(this).find(":first").clone();
		$(this).empty();
		var path_chunks = key.split("/");
		for (var i=0; i < path_chunks.length; i++) {
			var e = path_elem.clone();
			var p = path_chunks[i];
			for (var u=0; u < i; u++)
				p = path_chunks[u] + "/" + p;
			$(e).attr("href", "#"+p);
			$(e).html(path_chunks[i]+"/");
			$(this).append(e);
		}
	});

	// Update tags
	$(elem).find(".tag-container").html(function() {
		var tag_elem = $(this).find(":first").clone();
		$(this).empty();
		for (var i=0; i < meta_data["tags"].length; i++) {
			var e = tag_elem.clone();
			$(e).attr("href", "#");
			$(e).find(".label").html(meta_data["tags"][i]);
			$(this).append(e);
			$(this).append(" ");
		}
	});

	// Update thumbnails (Both views)
	var thumb_src_base = "thumbnails" + "/" + key + "/";

	if (meta_data["thumbnails"] !== undefined && meta_data["thumbnails"].length > 0) {
		if (meta_data["thumbnails"].length > 0)
			$(elem).find(".thumbnail-preview img").attr("src", thumb_src_base + meta_data["thumbnails"][0]["name"]);

		$(elem).find(".thumbnail-container").html(function() {
			var thumb_elem = $(this).find(":first").clone();
			$(this).empty();
			for (var i=0; i < meta_data["thumbnails"].length; i++) {
				var e = thumb_elem.clone();
				$(e).find("img").attr("src", thumb_src_base + meta_data["thumbnails"][i]["name"]);
				$(e).find(".caption-target").html(meta_data["thumbnails"][i]["caption"]);
				$(this).append(e);
			}
		});
	}

	// Update various information
	$(elem).find(".description-target").html(meta_data["description"]);
	$(elem).find(".origin-target").html(meta_data["origin"]);
	$(elem).find(".contact-target").html(meta_data["contact"]);
	$(elem).find(".license-target").html(meta_data["license"]);
	$(elem).find(".notes-target").html(meta_data["notes"]);
	$(elem).find(".acknowledgements-target").html(meta_data["acknowledgements"]);

	// Update Citations
	$(elem).find(".citations-container").html(function() {
		var cit_elem = $(this).find(":first").clone();
		$(this).empty();
		for (var i=0; i < meta_data["citations"].length; i++) {
			var e = cit_elem.clone();
			$(e).find(".payload-target").html(meta_data["citations"][i]["payload"]);
			$(e).find(".type-target").html(meta_data["citations"][i]["type"]);
			$(this).append(e);
		}
	});

	// Update Files
	var fc = $(elem).find(".files-container").html(function() {
		var file_elem = $(this).find(":first").clone();
		$(this).empty();
		for (var i=0; i < meta_data["files"].length; i++) {
			var e = file_elem.clone();

			// Set default values
			if (meta_data["files"][i]["resolution"] == undefined)
				meta_data["files"][i]["resolution"] = [];

			if (meta_data["files"][i]["name"] == undefined)
				meta_data["files"][i]["name"] = "";

			if (meta_data["files"][i]["format"] == undefined)
				meta_data["files"][i]["format"] = "";

			if (meta_data["files"][i]["description"] == undefined)
				meta_data["files"][i]["description"] = "";

			if (meta_data["files"][i]["filelist"] == undefined)
				meta_data["files"][i]["filelist"] = [];

			// Flatten resolution elements to one string
			var res = meta_data["files"][i]["resolution"].join().replace(/,/g, " x ");

			$(e).find(".files-name-target").html(meta_data["files"][i]["name"]);
			$(e).find(".files-format-target").html(meta_data["files"][i]["format"]);
			$(e).find(".files-description-target").html(meta_data["files"][i]["description"]);
			$(e).find(".files-resolution-target").html(res);
			$(e).find(".files-filelist-container").html(function() {
				var filelist_elem = $(this).find(":first").clone();
				$(this).empty();
				for (var u=0; u < meta_data["files"][i]["filelist"].length; u++) {
					var f = filelist_elem.clone();
					$(f).find(".files-filelist-name-target").html(meta_data["files"][i]["filelist"][u]["name"]);
					$(f).find(".files-filelist-size-target").html(meta_data["files"][i]["filelist"][u]["size"]);
					$(this).append(f);
				}
			});

			$(this).append(e);
		}
	});

	// FUNCTIONALITY

	// Implement hide show
	$(elem).find(".maximize-view").on("click", function() {
		$(".element").removeClass("element-maximized").addClass("element-minimized");
		$(elem).removeClass("element-minimized");
		$(elem).addClass("element-maximized");

		$(".max-view").hide();
		$(".min-view").show();
		$("#"+id+" .min-view").hide();
		$("#"+id+" .max-view").show();

		masonry_obj.layout();
	});

	$(elem).find(".minimize-view").on("click", function() {
		$(elem).removeClass("element-maximized");
		$(elem).addClass("element-minimized");

		$(".max-view").hide();
		$("#"+id+" .min-view").show();

		masonry_obj.layout();
		
		//$('html, body').stop().animate({ scrollTop: $("#"+id).offset().top }, 200);
	})

	// Update collapse references
	$(elem).find(".btn[data-toggle='collapse']").on("click", function() {
		//var target = "#"+id+" "+$(this).attr("data-target");
		//$(this).attr("data-target", target);

		var target = $(elem).find($(this).attr("data-target"));
		target.collapse("toggle");
		target.on("hidden.bs.collapse", function() {
			masonry_obj.layout();
		});

		target.on("shown.bs.collapse", function() {
			masonry_obj.layout();
		});

		//console.log(target);
	});

	$(elem).show();

	return elem;
}

// This is a second filter applied orthogonal to list.js filtering
function customFilterElements() {

	var path = window.location.hash.substr(1);

	//if (path.length > 0) {
		//console.log("path is "+path);
		//console.log( $(".element#path"));
		$(".element").hide();
		$(".element").has("#path:contains('"+path+"')").show();
	//}
}

// Use hashtag to filter data based on path
$(window).on('hashchange', function() {
	var hash = window.location.hash.substr(1);

	// Remove all but first
	$('#breadcrumb li').not('li:first').remove();

	// Create trailing breadcrumbs
	var path_chunks = hash.split("/");

	for (var i=0; i < path_chunks.length; i++) {
		var p = path_chunks[i];
		if (p.length == 0)
			continue;

		for (var u=0; u < i; u++)
			p = path_chunks[u] + "/" + p;
		$('#breadcrumb').append("<li><a href='#"+p+"'>"+path_chunks[i]+"</a></li>");
	}

	customFilterElements();

	masonry_obj.layout();
});
