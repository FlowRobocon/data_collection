const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};


function create_table(task_id, json_data) {
    // const json_data = '[{"id": 1,"speaker": "user","intent": "教える","slots": {"ユーザの名前": "鈴木"}},{"id": 2,"speaker": "system","intent": "観光地の名称を確認する","slots": {"ユーザの名前": "鈴木","観光地1の名称": "お台場海浜公園","観光地2の名称": "第三台場"}}]';
    const dialog = json_data;

    var t_re = "";
    let table_title = "task" + task_id;

    t_re += '<table border="1" style="width:100%" align="center">' +
        '<caption>' +
        '<div class="text-center">' +
        '</br></br>' +
        '<h3>' +
        table_title +
        '</h3>' +
        '<h5>' + 'ユーザの名前"に（※）が付いている場合には，話し相手をその名前で呼ぶような発話を作成してください．<br />' +
        '(例)「発話意図：質問する，ユーザの名前：鈴木，観光地への同行者：空欄」の場合' +
        '「鈴木様はどなたとご観光される予定ですか？」' + '</h5>' +
        '</div>' +
        '</caption>' +
        '<tbody>' +
        '<th style="width:10%; text-align:center">話者</th>' +
        '<th style="width:40%; text-align:center" colspan="2">発話の意味</th>' +
        '<th style="width:50%; text-align:center">発話文</th>'

    for (var i = 0; i < dialog.length; i++) {
        var table_tmp = '<tr>'
        let rowspan = String(1+Object.keys(dialog[i].slots).length)
        if (dialog[i].speaker == "system") {
            table_tmp += '<td style="width:10%; text-align:center" rowspan='+ rowspan + '>店員</td>'
        } else if (dialog[i].speaker == "user") {
            table_tmp += '<td style="width:10%; text-align:center" rowspan='+ rowspan + '>客</td>'
        }

        table_tmp += '<td style="width:20%;">発話意図</td><td style="width:20%;">' + dialog[i].intent + '</td>'
        table_tmp += '<td rowspan=' + rowspan + '>' +
            '<li><input type="text" id="' + task_id + "_" + dialog[i].id + "_" + dialog[i].speaker + "_utterance1" + '" name="' + dialog[i].id + "_" + i + "_" + dialog[i].speaker + "_utterance1" + '" style="width:90%;margin:2 0px;resize:none" placeholder="1つ目の発話文を入力してください"/></li>' +
            '<li><input type="text" id="' + task_id + "_" + dialog[i].id + "_" + dialog[i].speaker + "_utterance2" + '" name="' + dialog[i].id + "_" + i + "_" + dialog[i].speaker + "_utterance2" + '" style="width:90%;margin:2 0px;resize:none" placeholder="2つ目の発話文を入力してください"/></li>' +
            '</td></tr>';
        for (var s = 0; s < Object.keys(dialog[i].slots).length; s++) {
            if (Object.values(dialog[i].slots)[s] == "?") {
                table_tmp += '<tr><td style="width:20%;">' + Object.keys(dialog[i].slots)[s] + '</td><td style="width:20%;"></td></tr>'
            } else {
                table_tmp += '<tr><td style="width:20%;">' + Object.keys(dialog[i].slots)[s] + '</td><td style="width:20%;">' + Object.values(dialog[i].slots)[s] + '</td></tr>'
            }
        }
        t_re += table_tmp;
    }
    return t_re
};


function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
};


function submit(table_id) {
    // var dialog = json_data;
    var all_checked = true;
    var text_write = "id,speaker,intent,slots.keys,slots.values,utterance1,utterance2\n";

    // var gender = "";
    // var age = "";
    for (var j = 0; j < document.getElementsByName("Gender").length; j++) {
        if (document.getElementsByName("Gender")[j].checked) {
            gender = document.getElementsByName("Gender")[j].value;
        }
    }

    for (var j = 0; j < document.getElementsByName("Age").length; j++) {
        if (document.getElementsByName("Age")[j].checked) {
            age = document.getElementsByName("Age")[j].value;
        }
    }

    // if (document.getElementById("WorkerID").value == "" || age == "" || gender == "") {
    if (document.getElementById("WorkerID").value == "" || document.getElementById("WorkerName").value == "") {
        all_checked = false;
        // alert("ワーカーID，性別，年代を入力してください．");
        alert("ワーカーID、CrowdWorksでの表示名を入力してください．");
        return;
    }

    for (var i = 0; i < json_data.length; i++) {
        var value_tmp = json_data[i].id + "," + json_data[i].speaker + "," + json_data[i].intent + ",";
        var value_tmp_slots_keys = "";
        var value_tmp_slots_values = "";
        for (var j = 0; j < Object.keys(json_data[i].slots).length; j++) {
            value_tmp_slots_keys += Object.keys(json_data[i].slots)[j] + " ";
            value_tmp_slots_values += Object.values(json_data[i].slots)[j] + " ";
        }
        value_tmp += value_tmp_slots_keys.trimRight() + "," + value_tmp_slots_values.trimRight() + ",";

        var replace1 = "";
        var replace2 = "";
        replace1 = document.getElementById(task_id + "_" + json_data[i].id + '_' + json_data[i].speaker + "_utterance1").value;
        replace2 = document.getElementById(task_id + "_" + json_data[i].id + '_' + json_data[i].speaker + "_utterance2").value;
        if (replace1 == "" || replace2 == "") all_checked = true;
        else value_tmp += replace1 + "," + replace2;

        text_write += value_tmp + "\n";
    }

    if (all_checked == true) download(table_id + "_" + task_id + "_" + document.getElementById("WorkerID").value + "_" + document.getElementById("WorkerName").value + ".csv", text_write);
    else alert(dialog_id + "つ目の対話欄に入力されていない項目があります．");
};
