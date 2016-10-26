// GLOBAL OBJECTS

// TEMPLATE BASE OBJECTS
var element_base;
var modal_base;
var tag_base;
var active_tag_base;
var counted_tag_base;

$(document).ready(function() {
	// --- CLONE & SETUP REFERENCE BASE ELEMENTS FROM HTML ---
	element_base = $("#element-base").clone();
	$("#element-base").remove();

	modal_base = $("#modal-base").clone();
	$("#modal-base").remove();

	tag_base = $("#tag-base").clone();
	$("#tag-base").remove();

	active_tag_base = $("#active-tag-base").clone();
	$("#active-tag-base").remove();

	counted_tag_base = $("#counted-tag-base").clone();
	$("#counted-tag-base").remove();

	// --- LOAD DATA ---
	loadAndPopulateData();

	// --- UPDATE TAGS ---
	updateTagList();

	// List
	var listObj = new List('body', {
		valueNames: ['title', 'path', 'tag']
	});

	// Activate clipboard buttons
	var clipboard = new Clipboard('.copylinkbtn');

	/* debug
	clipboard.on('success', function(e) {
	    console.info('Action:', e.action);
	    console.info('Text:', e.text);
	    console.info('Trigger:', e.trigger);
	
	    e.clearSelection();
	});
	
	clipboard.on('error', function(e) {
	    console.error('Action:', e.action);
	    console.error('Trigger:', e.trigger);
	});*/
});

function onTagClick(event) {
	event.preventDefault();

	var tag = $(this).attr("tag");
	var $all_selected_matching_tags = $("#active-tag-container").find(".tag").filter(function() {
		return $(this).attr("tag") === tag;
	});
	if ($all_selected_matching_tags.length > 0) return;

	var new_elem = $(this).clone();
	$(new_elem).html("<span class='glyphicon glyphicon-remove'></span> " + tag);

	$(new_elem).off('click');
	$(new_elem).on('click', function(event) {
		event.preventDefault();
		$(this).remove();
		customFilterElements();
	});

	// Append element
	$("#active-tag-container").append(new_elem).append(" ");

	customFilterElements();
}

// Loads metalist containing references to all meta data
function loadAndPopulateData() {

	// Fetch global object
	var metas = data["datasets"];

	if (metas == undefined) {
		console.log("metaList object was undefined.");
		return;
	}

	// Target containers
	var element_container = $("#element-container");
	var modal_container = $("#modal-container");

	for (var key in metas) {
		var meta_data = metas[key];

		// Defaults
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

		element_container.append(createElement(key, meta_data));
		modal_container.append(createModal(key, meta_data));
	}

	// Add error list
	var errors = data["errors"];
	if (errors !== undefined && errors.length > 0) {
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
}

function updateTagList() {
	var taglist = getVisibleElementTagsMinusActiveTags();

	var tagcount = {};
	for (var i=0; i < taglist.length; i++) {
		var tag = taglist[i];
		if (tagcount.hasOwnProperty(tag))
			tagcount[tag]++;
		else
			tagcount[tag] = 1;
	}

	var sortedtags = [];
	for(var tag in tagcount) {
	    sortedtags[sortedtags.length] = tag;
	}
	sortedtags.sort(function (a, b) {
    	return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	var taglist_cont = $("#taglists-taglistlist-container");
	$(taglist_cont).empty();
	for (var i in sortedtags) {
		var tag = sortedtags[i];
		var item = counted_tag_base.clone();
		$(item).attr("tag", tag);
		$(item).find("#count-target").html(tagcount[tag]);
		$(item).find("#caption-target").html(tag);
		$(item).on('click', onTagClick);
		$(taglist_cont).append(item).append(" ");
	}
}

function humanFileSize(size) {
	// Guard against 0 => NaN undefined
	if (size == 0)
		return "";

	var i = Math.floor( Math.log(size) / Math.log(1024) );
	return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

function normalizePath(path){
    path = Array.prototype.join.apply(arguments,['/'])
    var sPath;
    while (sPath!==path) {
        sPath = n(path);
        path = n(sPath);
    }
    function n(s){return s.replace(/\/+/g,'/').replace(/\w+\/+\.\./g,'')}
    return path.replace(/^\//,'').replace(/\/$/,'');
}
function getfilepath(filepath, filename) {
	var path = window.location.pathname;
	path = path.substring(0,path.lastIndexOf("/")); // remove index.html
	var host = window.location.protocol +"//"+ window.location.host + "/"
			 + normalizePath(path + "/" + data["datapath"]);
	return host + "/" + filepath + "/" + filename;
}

function generateId(key) {
	return key.replace(/\//g, "-");
}

function setupPath(elem, path) {
	$(elem).find("#path").html(path);
	$(elem).find(".path-container").html(function() {
		var path_elem = $(this).find(":first").clone();
		$(this).empty();
		var path_chunks = path.split("/");
		for (var i=0; i < path_chunks.length ; i++) {
			var e = path_elem.clone();
			var p = path_chunks[0];
			for (var u=1; u <= i; u++)
				p = p + "/" + path_chunks[u];

			$(e).attr("href", "#"+p);
			$(e).html(path_chunks[i]);
			if (i < path_chunks.length-1)
				$(e).append("/");

			$(this).append(e);
		}
	});
}

function setupTags(elem, tags) {
	$(elem).find(".tag-container").html(function() {
		var tag_elem = $(this).find(":first").clone();
		$(this).empty();
		for (var i=0; i < tags.length; i++) {
			var e = tag_elem.clone();
			$(e).html(tags[i]);
			$(e).attr("tag", tags[i]);
			$(this).append(e);
			$(this).append(" ");

			$(e).on('click', onTagClick);
		}
	});
}

function createModal(key, meta_data) {
	var modal = $(modal_base).clone(true);
	var id = generateId(key);

	// Update id
	$(modal).attr("id", "modal-"+id);

	// Update header/title
	$(modal).find(".title").html(meta_data["name"]);

	// Update path
	setupPath(modal, key);

	// Update tags
	setupTags(modal, meta_data["tags"]);

	// Update thumbnails (Both views)
	var thumb_src_base = "thumbnails" + "/" + key + "/";

	if (meta_data["thumbnails"] !== undefined && meta_data["thumbnails"].length > 0) {
		$(modal).find(".thumbnail-container").html(function() {
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

	// Update various information
	$(modal).find(".description-target").html(meta_data["description"]);
	$(modal).find(".origin-target").html(meta_data["origin"]);
	$(modal).find(".contact-target").html(meta_data["contact"]);
	$(modal).find(".license-target").html(meta_data["license"]);
	$(modal).find(".notes-target").html(meta_data["notes"]);
	$(modal).find(".acknowledgements-target").html(meta_data["acknowledgements"]);
	$(modal).find(".link-target").html(meta_data["link"]);
	$(modal).find(".link-target").attr("href", meta_data["link"]);

	// Update Citations
	if (meta_data["citations"].length > 0) {
		$(modal).find(".citations-container").html(function() {
			var cit_elem = $(this).find(":first").clone();
			$(this).empty();
			for (var i=0; i < meta_data["citations"].length; i++) {
				var e = cit_elem.clone();
				$(e).find(".payload-target").html(meta_data["citations"][i]["payload"]);
				$(e).find(".type-target").html(meta_data["citations"][i]["type"]);
				$(this).append(e);
			}
		});

		// Set unique ID for collapse target
		var collapse_button = $(modal).find(".btn[data-target='#citations-container-div']");
		var collapse_target = $(modal).find("#citations-container-div");
		var new_id = id + "-citations-container";

		collapse_button.attr("data-target", "#" + new_id);
		collapse_target.attr("id", new_id)
	}
	else {
		$(modal).find("#citations-panel").remove();
	}

	// Update Files
	if (meta_data["files"].length > 0) {
		var fc = $(modal).find("#file-element-container").html(function() {
			var file_elem = $(this).find(":first").clone(true);
			$(this).empty();
			for (var i=0; i < meta_data["files"].length; i++) {
				var e = file_elem.clone(true);

				// Set the desciption
				if (meta_data["files"][i]["description"] == undefined)
					meta_data["files"][i]["description"] = "undefined";
				$(e).find(".file-element-description-target").html(
					meta_data["files"][i]["description"]
				);

				// set the name pattern
				if (meta_data["files"][i]["name"] == undefined) {
					meta_data["files"][i]["name"] = "";
				} else if (meta_data["files"][i]["name"] instanceof Array) {
					names = meta_data["files"][i]["name"].join(", ");
				} else {
					names = meta_data["files"][i]["name"];
				}
				$(e).find(".file-element-name-target").html(names);

				// set the file list
				var totalFileSize = 0;
				if (meta_data["files"][i]["filelist"] == undefined)
					meta_data["files"][i]["filelist"] = [];
				$(e).find(".file-element-filelist-container").html(function() {
					var filelist_elem = $(this).find(":first").clone();
					$(this).empty();
					for (var u=0; u < meta_data["files"][i]["filelist"].length; u++) {
						var fle = filelist_elem.clone();
						var fli = meta_data["files"][i]["filelist"][u];

						// Provide meaningful default values
						if (fli["name"] == undefined) fli["name"] = "";
						if (fli["size"] == undefined) fli["size"] = 0;

						totalFileSize += fli["size"];

						$(fle).find(".file-element-filelist-name-target").html(fli["name"]);
						$(fle).find(".file-element-filelist-size-target").html(humanFileSize(fli["size"]));
						var filepath = getfilepath(key, fli["name"]);
						$(fle).find(".file-element-filelist-copy-target").attr("data-clipboard-text", filepath);
						$(fle).find(".file-element-filelist-open-target").attr("href", filepath);
						$(this).append(fle);
					}
				});

				// set the info list
				$(e).find(".file-element-label-info-taget").html(function() {
					var info_label_template = $(this).find(":first").clone();
					$(this).empty();
					if (meta_data["files"][i]["resolution"] != undefined) {
						var res = meta_data["files"][i]["resolution"].join().replace(/,/g, " x ");
						var label = $(info_label_template).clone(true);
						label.html(res);
						$(this).append(label).append(" ");
					}
					if (meta_data["files"][i]["format"] != undefined) {
						var label = $(info_label_template).clone(true);
						label.html(meta_data["files"][i]["format"]);
						$(this).append(label).append(" ");
					}
					var label = $(info_label_template).clone(true);
					label.html(humanFileSize(totalFileSize));
					$(this).append(label).append(" ");
					if (meta_data["files"][i]["tags"] != undefined) {
						for (var u=0; u < meta_data["files"][i]["tags"].length; u++) {
							var tag = meta_data["files"][i]["tags"][u];
							var label = $(info_label_template).clone(true);
							label.html(tag);
							$(this).append(label).append(" ");
						}
					}
				});

				// Set unique ID for collapse target
				var file_collapse_button = $(e).find(".btn[data-target='#file-element-body']");
				var file_collapse_target = $(e).find("#file-element-body");
				var new_id = id + "-file-element-body-" + i;

				file_collapse_button.attr("data-target", "#" + new_id);
				file_collapse_target.attr("id", new_id);

				$(this).append(e);
			}
		});
	}
	else {
		$(modal).find("#files-panel").remove();
	}

	// --- FUNCTIONALITY ---

	// --- MODALS ---
	// Update modal targets
	const modal_id = "modal-" + id;
	$(modal).find(".modal").attr("id", modal_id);
	//$(elem).find("[data-toggle='modal']").attr("data-target", "#"+modal_id);

	const element_id = "element-" + id;
	// Setup prev and next modal functionality
	$(modal).find("[data-action='next-modal']").on("click", function() {
		$(".modal").modal("hide");
		// TODO: Simplify this query?
		var next_modal_id = $("#"+element_id).nextAll(":visible").first().find("[data-toggle='modal']").attr("data-target");
		$(next_modal_id).modal("show");
	});

	$(modal).find("[data-action='prev-modal']").on("click", function() {
		$(".modal").modal("hide");
		// TODO: Simplify this query?
		var prev_modal_id = $("#"+element_id).prevAll(":visible").first().find("[data-toggle='modal']").attr("data-target");
		$(prev_modal_id).modal("show");
	});

	const minimize_class_list = "col-xs-4 col-sm-4 col-md-3 col-lg-3 col-xl-3";
	const maximize_class_list = "col-xs-12";

	// Setup functionality of thumbnails
	$(modal).find("#thumbnail-container").each(function() {
		var thumbnail_container = $(this);
		var thumbnail_divs = $(this).find(".thumbnail-div");

		// Set up thumbnail on click
		$(this).find("a").on("click", function(e) {
			e.preventDefault();

			var this_thumbnail_div = $(this).closest(".thumbnail-div");

			// TODO: This could possibly be optimized to minimize state changes within elements
			if (this_thumbnail_div.hasClass("col-xs-12")) {
				// Minimize and show all
				thumbnail_divs.show();
				thumbnail_divs.removeClass(maximize_class_list);
				thumbnail_divs.addClass(minimize_class_list);
			}
			else {
				// Hide all and Maximize + show this
				thumbnail_divs.hide();
				this_thumbnail_div.removeClass(minimize_class_list);
				this_thumbnail_div.addClass(maximize_class_list);
				this_thumbnail_div.show();
			}
		});
	});

	// Minimize thumbnails when modal closes
	$(modal).on('hidden.bs.modal', function () {
		var thumbnail_divs = $(this).find("#thumbnail-container").find(".thumbnail-div");
	    thumbnail_divs.show();
		thumbnail_divs.removeClass(maximize_class_list);
		thumbnail_divs.addClass(minimize_class_list);
	});

	return modal;
}

function createElement(key, meta_data) {
	var elem = $(element_base).clone(true);
	var id = generateId(key);

	// Update id
	$(elem).attr("id", "element-"+id);

	// Update header/title
	$(elem).find(".title").html(meta_data["name"]);

	// Update path
	setupPath(elem, key);

	// Update tags
	setupTags(elem, meta_data["tags"]);

	// Update thumbnails (Both views)
	var thumb_src_base = "thumbnails" + "/" + key + "/";

	if (meta_data["thumbnails"] !== undefined && meta_data["thumbnails"].length > 0) {
		if (meta_data["thumbnails"].length > 0) {
			var src = thumb_src_base + meta_data["thumbnails"][0]["name"];
			var cap = meta_data["thumbnails"][0]["caption"];

			$(elem).find(".thumbnail-preview a").attr("data-footer", cap);
			$(elem).find(".thumbnail-preview img").attr("src", src);
		}
	}

	// Update various information
	$(elem).find(".description-target").html(meta_data["description"]);

	// --- FUNCTIONALITY ---

	// --- MODALS ---
	// Update modal targets
	const modal_id = "modal-" + id; 
	$(elem).find("[data-toggle='modal']").attr("data-target", "#"+modal_id);

	$(elem).show();
	return elem;
}

function getVisibleElementTagsMinusActiveTags() {
	var element_tags = getVisibleElementTags();
	var active_tags = getActiveTags();

	element_tags = element_tags.filter(function(elem) {
		for (var i=0; i < active_tags.length; i++) {
			if (elem == active_tags[i])
				return false;
		}
		return true;
	});

	return element_tags;
}

function getVisibleElementTags() {
	return extractTagsAsStrings($("#element-container").find(".element:visible").find("#element-tag-container"));
}

function getActiveTags() {
	return extractTagsAsStrings($("#active-tag-container"));
}

function extractTagsAsStrings(q_obj) {
	var tag_array = [];
	$(q_obj).find(".tag").each(function() {
		tag_array.push($(this).attr("tag"));
	});

	return tag_array;
}

// Returns true if all strings within filter_tags are represented in element_tags
// TODO: Use hash-table to identify tags?
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
		// Get tags for this element
		var element_tag_array = extractTagsAsStrings($(this).find("#element-tag-container"));
		var q1 = $(this).find("#path:contains('"+path+"')").length > 0;
		var q2 = filterTags(element_tag_array, filter_tag_array);
		return q1 && q2;
	}).show();

	updateTagList();
}

// Use hashtag to filter data based on path
$(window).on('hashchange', function() {
	var hash = window.location.hash.substr(1);

	// Remove all but first
	$('#breadcrumb li').not('li:first').remove();

	// Create trailing breadcrumbs
	var path_chunks = hash.split("/");

	for (var i=0; i < path_chunks.length; i++) {
		if (path_chunks[i].length == 0)
			continue;

		var p = path_chunks[0];
		for (var u=1; u <= i; u++)
			p = p + "/" + path_chunks[u];

		$('#breadcrumb').append("<li><a href='#"+p+"'>"+path_chunks[i]+"</a></li>");
	}

	customFilterElements();
});
