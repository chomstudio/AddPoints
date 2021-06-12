var SCRIPT_TITLE = "Add points to each selected notes";

//ノート頭からその前後のポイントの距離を秒で指定
var POINT_GAP_SECOND = 0.1;

function getClientInfo() {
  return {
    "name" : SV.T(SCRIPT_TITLE),
    "author" : "Chomstudio",
    "versionNumber" : 1.0,
    "minEditorVersion" : 65537
  };
}

function getTranslations(langCode) {
  if(langCode == "ja-jp") {
    return [
      ["Add points to each selected notes", "各選択ノートに制御点を追加"],
      ["Nothing selected", "何も選択されていません"]
    ];
  }
  return [];
}

// ノートごとに前後にアンカーを打つ
function anchorByNote(note, gapBlick) {

  //ノートの開始位置とその前後のblick
  pointBlick = note.getOnset();
  beforePointBlick = pointBlick - gapBlick;
  if( beforePointBlick < 0 ) beforePointBlick = 0;
  afterPointBlick = pointBlick + gapBlick;

  //Loudness オートメーションを取得
  //getParentで所属NoteGroupが取れるっぽい
  group = note.getParent();
  automation = group.getParameter("loudness");

  //値0でポイントを打つ
  automation.add( pointBlick, 0 );
  //前に打つ
  automation.add( beforePointBlick, 0 );
  //後ろに打つ
  automation.add( afterPointBlick, 0 );

  return;
}

//メイン
function main() {

  //アンカーの間隔をblickに変換しておく
  ta = SV.getProject().getTimeAxis();
  gapBlick = ta.getBlickFromSeconds(POINT_GAP_SECOND);

  //ピアノロール上で選択範囲を取得
  sl = SV.getMainEditor().getSelection();

  //何も選択されていなければなにもしない
  if(!sl.hasSelectedNotes() && !sl.hasSelectedGroups()) {

    //メッセージ一応出すけどなくてもいいかな…
    SV.showMessageBox(SV.T(SCRIPT_TITLE), SV.T("Nothing selected"));

  } else {

    //選択中のノート（noteGroupを除く）に対して
    notes = sl.getSelectedNotes();
    //memo: for..of も forEach も map も使えない…
    for( i=0; i<notes.length; i++) {
      anchorByNote( notes[i], gapBlick );
    }

    /*
    //memo:当初選択中のnoteGroupに対してもアンカーを打つ仕様を考えていたが、
    //groupを開かないとアンカーが見えない（編集できない）ため、
    //「気づかないうちに勝手に編集された」感覚を避けるために見送り。

    //選択中のnoteGroupsに対して
    groups = sl.getSelectedGroups();
    for( i=0; i<groups.length; i++) {
      group = groups[i].getTarget();
      for( j=0; j<group.getNumNotes(); j++) {
        anchorByNote( group.getNote(j), gapBlick );
      }
    }
    */

  }

  //おわり
  SV.finish();
}
