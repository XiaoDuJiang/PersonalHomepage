<?php
/**
 * Created by PhpStorm.
 * User: lenovo
 * Date: 2018/5/4
 * Time: 14:16
 */

namespace Home\Logic;

use Think\Model;

class NoteLogic extends Model
{
    /**
     * 保存笔记
     */
    public function addNote($note)
    {
        $id = $note->add();
        return $id;
    }


    /**
     * 根据notetitlid、index(层级)、获取笔记标题
     */
    public function getNoteNameByIndex($titleid, $index)
    {
        $condition['titleid'] = $titleid;
        $condition['index'] = $index;
        $result = M('note')->field("id,title")->where($condition)->select();
        return $result;
    }

}