var masonry_obj;

$(document).ready(function() {
	// --- LOAD DATA ---
	loadAndPopulateData();

	// --- INIT EXTERNAL OBJECTS ---

	// Masonry
	masonry_obj = new Masonry('.grid', {
	  // options
	  itemSelector: '.item',
	  columnWidth: '.element:not([style*="display: none"])'
	});

	// layout Masonry after each image loads
	imagesLoaded(masonry_obj, function() {
		masonry_obj.layout();
	});

	// List
	var listObj = new List('body', {
		valueNames: ['title', 'path', 'tag']
	});

	listObj.on("searchComplete", function() {
		masonry_obj.layout();
	})
});

$(document).on('click', '[data-toggle="lightbox"]', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox();
});

function onTagClick(event) {
	event.preventDefault();

	var tag = $(this).attr("tag");
	var $all_selected_matching_tags = $("#active-tag-container").find(".tag").filter(function() {
		return $(this).attr("tag") === tag;
	});
	if ($all_selected_matching_tags.length > 0) return;

	var new_elem = $(this).clone();
	$(new_elem).html("<span class='glyphicons glyphicons-remove'></span>" + tag);

	$(new_elem).off('click');
	$(new_elem).on('click', function(event) {
		event.preventDefault();
		$(this).remove();
		customFilterElements();
		masonry_obj.layout();
	});

	// Append element
	$("#active-tag-container").append(new_elem).append(" ");

	customFilterElements();
	masonry_obj.layout();
}

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
	$("#example-element").find('[data-toggle="lightbox"]').attr("data-footer", "");

	var container = document.getElementById("element-container");
	for (var key in metas) {
		container.appendChild(createElement(key, metas[key]));
	}

	// Remove example element
	$("#example-element").remove();

	// Add error list
	var errors = data["errors"];
	if (errors.length > 0) {
		var error_cont = $("#errors-errorlist-container");
		var errorlist_elem = $(error_cont).find(":first").clone();
		$(error_cont).empty();
		for (var u=0; u < errors.length; u++) {
			var item = errorlist_elem.clone();
			$(item).find(".errors-errorlist-error-target").html(errors[u]);
			$(error_cont).append(item);
		}
	} else {
		$("#error-container-elem").remove();
	}

	// Add tag list
	var taglist = {};
	for (var key in metas) {
		if (metas[key]["tags"] != undefined) {
			for (var i in metas[key]["tags"]) {
				var tag = metas[key]["tags"][i]
				if (taglist.hasOwnProperty(tag)) {
					taglist[tag]++;
				} else {
					taglist[tag] = 1;
				}
			}
		}
	}
	var taglist_cont = $("#taglists-taglistlist-container");
	var taglist_elem = $(taglist_cont).find(":first").clone();
	$(taglist_cont).empty();

	for (var key in taglist) {
		var item = taglist_elem.clone();
		$(item).html(key + ": " + taglist[key]);
		$(item).attr("tag", key);
		$(taglist_cont).append(item);
		$(taglist_cont).append(" ");
		console.log(key + " : " + taglist[key]);
		$(item).on('click', onTagClick);
	}
}

function humanFileSize(size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

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
	
	if (meta_data["link"] == undefined)
		meta_data["link"] = "";

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
		for (var i=0; i < path_chunks.length ; i++) {
			var e = path_elem.clone();
			var p = path_chunks[i];
			for (var u=0; u < i; u++)
				p = path_chunks[u] + "/" + p;
			$(e).attr("href", "#"+p);
			if (i == path_chunks.length -1 ) {
				$(e).html(path_chunks[i]);
			} else {
				$(e).html(path_chunks[i]+"/");
			}
			$(this).append(e);
		}
	});

	// Update tags
	$(elem).find(".tag-container").html(function() {
		var tag_elem = $(this).find(":first").clone();
		$(this).empty();
		for (var i=0; i < meta_data["tags"].length; i++) {
			var e = tag_elem.clone();
			$(e).html(meta_data["tags"][i]);
			$(e).attr("tag", meta_data["tags"][i]);
			$(this).append(e);
			$(this).append(" ");

			$(e).on('click', onTagClick);
		}
	});

	// Update thumbnails (Both views)
	var thumb_src_base = "thumbnails" + "/" + key + "/";

	if (meta_data["thumbnails"] !== undefined && meta_data["thumbnails"].length > 0) {
		if (meta_data["thumbnails"].length > 0) {
			// Minimized view
			{
				var src = thumb_src_base + meta_data["thumbnails"][0]["name"];
				var cap = meta_data["thumbnails"][0]["caption"];

				$(elem).find(".thumbnail-preview a").attr("href", src).attr("data-footer", cap);
				$(elem).find(".thumbnail-preview img").attr("src", src);
			}

			// Maximized view
			$(elem).find(".thumbnail-container").html(function() {
				var thumb_elem = $(this).find(":first").clone();
				$(this).empty();
				for (var i=0; i < meta_data["thumbnails"].length; i++) {
					var e = thumb_elem.clone();
					var src = thumb_src_base + meta_data["thumbnails"][i]["name"];
					var cap = meta_data["thumbnails"][i]["caption"];

					$(e).find("a").attr("href", src).attr("data-footer", cap).attr("data-gallery", id);
					$(e).find("img").attr("src", src);
					$(e).find(".caption-target").html(cap);
					$(this).append(e);
				}
			});
		}
	}

	// Update various information
	$(elem).find(".description-target").html(meta_data["description"]);
	$(elem).find(".origin-target").html(meta_data["origin"]);
	$(elem).find(".contact-target").html(meta_data["contact"]);
	$(elem).find(".license-target").html(meta_data["license"]);
	$(elem).find(".notes-target").html(meta_data["notes"]);
	$(elem).find(".acknowledgements-target").html(meta_data["acknowledgements"]);
	$(elem).find(".link-target").html(meta_data["link"]);

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

			if (meta_data["files"][i]["name"] instanceof Array) {
				names = meta_data["files"][i]["name"].join(", ");
			} else {
				names = meta_data["files"][i]["name"];
			}

			var totalFileSize = 0;

			$(e).find(".files-name-target").html(names);
			$(e).find(".files-format-target").html(meta_data["files"][i]["format"]);
			$(e).find(".files-description-target").html(meta_data["files"][i]["description"]);
			$(e).find(".files-resolution-target").html(res);
			$(e).find(".files-filelist-container").html(function() {
				var filelist_elem = $(this).find(":first").clone();
				$(this).empty();
				for (var u=0; u < meta_data["files"][i]["filelist"].length; u++) {
					var f = filelist_elem.clone();
					$(f).find(".files-filelist-name-target").html(meta_data["files"][i]["filelist"][u]["name"]);
					var filesize = meta_data["files"][i]["filelist"][u]["size"];
					totalFileSize += filesize;
					$(f).find(".files-filelist-size-target").html(humanFileSize(filesize));
					$(this).append(f);
				}
			});
			$(e).find(".files-size-target").html(humanFileSize(totalFileSize));
			$(this).append(e);
		}
	});

	// --- FUNCTIONALITY ---

	const minimized_class_list = "col-xs-6 col-sm-4 col-md-3 col-lg-3 element-minimized";
	const maximized_class_list = "col-xs-12 element-maximized";

	// Implement hide show
	$(elem).find(".maximize-view").on("click", function() {
		// Set all elements to minimized
		$(".element").removeClass(maximized_class_list).addClass(minimized_class_list);
		// Set active element to maximized
		$(elem).removeClass(minimized_class_list).addClass(maximized_class_list);

		$(".max-view").hide();
		$(".min-view").show();
		$("#"+id+" .min-view").hide();
		$("#"+id+" .max-view").show();

		masonry_obj.layout();
	});

	$(elem).find(".minimize-view").on("click", function() {
		$(elem).removeClass(maximized_class_list).addClass(minimized_class_list);

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

function extractTagsAsStrings(q_obj) {
	var tag_array = [];
	$(q_obj).find(".tag").each(function() {
		tag_array.push($(this).attr("tag"));
	});

	return tag_array;
}

// Returns true if all strings within filter_tags are represented in element_tags
function filterTags(element_tags, filter_tags) {
	for (var i = filter_tags.length - 1; i >= 0; i--) {
		var listed = false;
		for (var u = element_tags.length - 1; u >= 0; u--) {
			if (element_tags[u] === filter_tags[i]) {
				listed = true;
				break;
			}
		}
		if (listed === false)
			return false;
	}

	return true;
}

// This is a second filter applied orthogonal to list.js filtering
function customFilterElements() {
	var path = window.location.hash.substr(1);
	var filter_tag_array = extractTagsAsStrings($("#active-tag-container"));

	$(".element").hide();

	$(".element").filter(function() {
		var element_tag_array = extractTagsAsStrings($(this).find("#element-tag-container"));

		var q1 = $(this).find("#path:contains('"+path+"')").length > 0;
		var q2 = filterTags(element_tag_array, filter_tag_array);

		return q1 && q2;
	}).show();
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
