<?php
/**
 * 首页控制器
 * User: 郭 奡
 * Date: 2018/4/9
 * Time: 10:12
 */

namespace Home\Controller;

use Think\Controller;
use Think\Exception;

class IndexController extends Controller
{
    /**
     * 上传说说
     */
    public function uploadShuoShuo()
    {
        if (IS_AJAX) {
            $DailyM = M('daily');
            $DailyM->create();

            if (!$DailyM->content) {
                $result = array(
                    'msg' => "说说内容不能为空",
                    'status' => '0'
                );
                $this->ajaxReturn($result);
            }
            //$DailyM->content = htmlspecialchars($DailyM->content);
            $DailyM->typeid = 1;
            $DailyM->createtime = date("Y-m-d H:i:s", time());
            //获取用户id
            $DailyM->uid = $_SESSION['userid'];
            if (!empty($_FILES)) {
                try {
                    $upload = new \Think\Upload();
                    $upload->maxSize = 3145728; //文件上传的大小限制
                    $upload->exts = array('jpg', 'gif', 'png', 'jpeg'); //上传文件后缀的样式
                    $upload->rootPath = './Uploads/shuoshuo-img/';   //上传文件根目录
                    $upload->saveName = 'com_create_guid'; //GUID保存文件名字

                    $fileSavePath = array();
                    $fileUploadsSuccess = true;
                    $fileMsg = '';

                    foreach ($_FILES as $val) {
                        $fileinfo = $upload->uploadOne($val);
                        if (!$fileinfo) {// 上传错误提示错误信息
                            $fileUploadsSuccess = false;
                            $fileMsg .= ($val['name'] . ":" . $upload->getError() . ";");
                        } else {// 上传成功
                            array_push($fileSavePath, $upload->rootPath . $fileinfo["savepath"] . $fileinfo["savename"]);
                        }
                    }

                    if (!$fileUploadsSuccess) {
                        //删除图片
                        foreach ($fileSavePath as $path) {
                            unlink($path);
                        }
                        $result = array(
                            'msg' => $fileMsg,
                            'status' => '0'
                        );
                        $this->ajaxReturn($result);
                    }

                    $fileUploadsIds = array();
                    $picLogic = D('Pic', 'Logic');
                    //储存图片
                    foreach ($fileSavePath as $path) {
                        $pic = M('pic');
                        $pic->createtime = date("Y-m-d H:i:s", time());
                        //1 daily 2 头像 3背景
                        $pic->type = 1;
                        $pic->picpath = $path;
                        $id = $picLogic->savePic($pic);
                        array_push($fileUploadsIds, $id);
                    }

                    $DailyM->picids = implode(',', $fileUploadsIds);
                } catch (Exception $e) {
                    $result = array(
                        'msg' => $e->getMessage(),
                        'status' => '0'
                    );
                    $this->ajaxReturn($result);
                }


            }

            try {
                //保存说说数据
                $dailyLogic = D('Daily', 'Logic');
                $dailyId = $dailyLogic->dailySave($DailyM);
                if ($dailyId) {
                    $result = array(
                        'msg' => '说说发布成功！',
                        'status' => '1'
                    );
                    $this->ajaxReturn($result);
                } else {
                    $result = array(
                        'msg' => '说说发布失败',
                        'status' => '0'
                    );
                    $this->ajaxReturn($result);
                }

            } catch (Exception $e) {
                $result = array(
                    'msg' => $e->getMessage(),
                    'status' => '0'
                );
                $this->ajaxReturn($result);
            }
        }
    }

    /**
     * 上传日志
     */
    public function uploadDaily()
    {
        if (IS_AJAX) {
            $DailyM = M('daily');
            $DailyM->create();
            $DailyM->typeid = 2;
            $DailyM->createtime = date("Y-m-d H:i:s", time());
            if (!$DailyM->content) {
                $result = array(
                    'msg' => "日志内容不能为空",
                    'status' => '0'
                );
                $this->ajaxReturn($result);
            }
            //获取用户id
            $DailyM->uid = $_SESSION['userid'];
            //$DailyM->content = htmlspecialchars($DailyM->content);
            //显示的时候用 htmlspecialchars_decode();
            try {
                //保存说说数据
                $dailyLogic = D('Daily', 'Logic');
                $dailyId = $dailyLogic->dailySave($DailyM);
                if ($dailyId) {
                    $result = array(
                        'msg' => '日志发布成功！',
                        'status' => '1'
                    );
                    $this->ajaxReturn($result);
                } else {
                    $result = array(
                        'msg' => '日志发布失败',
                        'status' => '0'
                    );
                    $this->ajaxReturn($result);
                }

            } catch (Exception $e) {
                $result = array(
                    'msg' => $e->getMessage(),
                    'status' => '0'
                );
                $this->ajaxReturn($result);
            }

        }
    }

    /**
     * 获取用户一级标题
     */
    public function getUserNoteTitle()
    {
        $uid = $_SESSION['userid'];
        $noteTitleLogic = D('Notetitle', 'Logic');
        $result = array();
        try {
            $result['list'] = $noteTitleLogic->getdailyList($uid);
            $result['msg'] = "成功";
            $result['status'] = 1;
        } catch (Exception $e) {
            $result['msg'] = "系统错误，笔记一级标题加载失败";
            $result['status'] = 0;
        }

        $this->ajaxReturn($result);
    }

    /**
     * 根据tiitleid获取用户二级标题
     */
    public function getUserSecondNote()
    {
        if (IS_AJAX) {
            $result = array();
            $titleid = $_POST['titleid'];
            $index = 0;
            if ($titleid) {
                try {
                    $noteLogic = D('Note', 'Logic');
                    $result['list'] = $noteLogic->getNoteNameByIndex($titleid, $index);
                    $result['msg'] = "成功";
                    $result['status'] = 1;
                } catch (Exception $e) {
                    $result['msg'] = "系统错误，获取二级标题失败";
                    $result['status'] = 0;
                }

            } else {
                $result['msg'] = "一级标题id不能为空";
                $result['status'] = 0;
            }

            $this->ajaxReturn($result);
        }
    }

    /**
     * 添加笔记内容
     */
    public function addStudyNote()
    {
        if (IS_AJAX) {
            //先验证
            if (($_POST['notetitle'] || $_POST['firsttitleid']) && $_POST['notename'] && $_POST['content']) {
                $result = array();

                //数据
                $titleid = 0;
                $index = 0;
                $fatherid = 0;

                $noteTitleLogic = D("Notetitle", "Logic");
                if ($_POST['notetitle']) {
                    //写入新标题
                    try {
                        $notetitleM = M('notetitle');
                        $data1['name'] = $_POST['notetitle'];
                        $data1['createtime'] = date("Y-m-d H:i:s", time());
                        $data1['uid'] = $_SESSION['userid'];
                        $notetitleM->create($data1);
                        $titleid = $noteTitleLogic->dailyAdd($notetitleM);
                    } catch (Exception $e) {
                        $result['msg'] = $e->getMessage();
                        $result['status'] = 0;
                        $this->ajaxReturn($result);
                    }
                } else if (!$_POST['firsttitleid'] && $_POST['firsttitleid'] == 0) {
                    $result['msg'] = "请输入或选择一级标题";
                    $result['status'] = 0;
                    $this->ajaxReturn($result);
                }

                if ($titleid == 0) {
                    $titleid = $_POST['firsttitleid'];
                }

                //判断写入的是一级笔记 index 0  还是二级笔记 index 1
                if ($_POST['secondtitleid'] && $_POST['secondtitleid'] != 0) {
                    $index = 1;
                    $fatherid = $_POST['secondtitleid'];
                }

                //组织数据
                $noteM = M('note');
                $data['title'] = $_POST['notetitle'];
                $data['content'] = $_POST['content'];
                $data['fatherid'] = $fatherid;
                $data['index'] = $index;
                $data['titleid'] = $titleid;
                $data['createtime'] = date("Y-m-d H:i:s", time());
                $noteM->create($data);

                $noteLogic = D("Note", "Logic");
                $id = $noteLogic->addNote($noteM);
                if ($id) {
                    $result['msg'] = "保存笔记成功";
                    $result['status'] = 1;
                } else {
                    $result['msg'] = "保存笔记失败";
                    $result['status'] = 0;
                }

            } else {
                $result['msg'] = "数据传递错误";
                $result['status'] = 0;
            }


            $this->ajaxReturn($result);
        }


    }
}