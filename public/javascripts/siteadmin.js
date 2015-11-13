function resetpass() {
	$.post("/admin/siteadmin/updateuserpass",
		{
			updatepass: true,
			newp: $('#pass').val(),
			uid: $('#uid').val()
		},
		function (result) {
			$('.result').html(result.msg);
		});
}


function updateuser() {
	$.post("/admin/siteadmin/updateuser",
		{
			updateuser: true,
			login: $('#userlogin').val(),
			name: $('#username').val(),
			uid: $('#uid').val()
		},
		function (result) {
			$('.result').html(result.msg);
		});
}

function updatesecgroup() {
	$.post("/admin/siteadmin/updatesecgroup",
		$('#updategroup').serialize(),
		function (result) {
			$('.result').html(result.msg);
		});
}

function addsecgroup(){
	
}

function adduser(){
		$.post("/admin/siteadmin/adduser",
		{
			updateuser: true,
			login: $('#userlogin').val(),
			name: $('#username').val(),
			pass: $('#pass').val()
		},
		function (result) {
			$('.result').html(result.msg);
		});
}