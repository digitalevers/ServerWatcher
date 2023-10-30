import Utils from '../../assets/js/utils.js';

let app = getApp();
Page({
  data: {
    show: false,        //是否显示域名填写框
    showAddServerModal:false,  //是否显示添加服务器对话框
    validDomain:false,  //JS正则匹配所填写域名是否合法
    domain:'http://dingtalk.digitalevers.com',     //接口地址
    listData:[],
    showAuthUser:false, //是否显示授权员工面板
    addAuthUser:false,  //是否显示添加授权员工对话框
    authorizationUserData:{},      //需要添加授权员工表单数据
    array:['中控服务器','应用服务器'],
    curOptServerIndex:-1           //当前操作的服务器索引ID
  },
  
  Utils: new Utils(),
 
  onLoad() {
      let that = this
      //查找缓存中是否已经存放域名 未存放则弹出添加域名对话框提示添加
      // dd.getStorage({
      //   key: 'hubDomain',
      //   success: function(res) {
      //     //console.log(res)
      //     //缓存中没有域名
      //     if(!res.data){
      //       dd.getAuthCode({
      //         //corpId:"ding80ef5106dc236da9ffe93478753d9884", //H5应用必需
      //         success:function(authRes){
      //           //console.log(authRes)
      //           dd.httpRequest({
      //             url: 'http://dingtalk.digitalevers.com/dingtalk.php?opt=dingtalk&code='+authRes.authCode,
      //             method: 'GET',
      //             data: {},
      //             dataType: 'json',
      //             timeout:2000,
      //             success: function(serversRes) {
      //               console.log(serversRes)
      //               if(serversRes.data != 2){
      //                 that.setData({'show':true})
      //               } else {
      //                 dd.setStorage({
      //                   key: 'hubDomain',
      //                   data:'dingtalk.digitalevers.com'
      //                 });
      //               }
      //             },
      //             fail:(fail) => { dd.alert({content:fail}) },
      //           });
      //         },
      //         fail: () => {dd.alert({content:"fail"});},
      //       })
      //     } else {
      //       //缓存中已有域名
      //       that.setData({'domain':res.data})
      //       //请求接口获取服务资源数据
      //       dd.getAuthCode({
      //           success:function(authRes){
      //             dd.httpRequest({
      //               url: 'http://'+res.data+'/dingtalk.php?opt=listServer&code='+authRes.authCode,
      //               method: 'GET',
      //               data: {},
      //               dataType: 'json',
      //               timeout:2000,
      //               success: function(serversRes) {
      //                 that.setData({'listData':serversRes.data.data})
      //               },
      //               fail: function(res) {
      //                 //console.log(res)
      //               }
      //             });
      //           },
      //           fail:function(err){}
      //       });
      //     }
      //   },
      //   fail: function(res){
      //     dd.alert({content: res.errorMessage});
      //   }
      // });

      //请求接口获取服务资源数据
      dd.getAuthCode({
        success:function(authRes){
          dd.httpRequest({
            url: that.data.domain+'/dingtalk.php?opt=listServer&code='+authRes.authCode,
            method: 'GET',
            data: {},
            dataType: 'json',
            timeout:2000,
            success: function(serversRes) {
              that.setData({'listData':serversRes.data.data})
              //注册钉钉回调
              dd.getStorage({
                key: 'registerd',
                success: function(res) {
                  //console.log(res)
                  //缓存中显示未注册钉钉回调
                  if(!res.data){
                    dd.getAuthCode({
                      success:function(authRes){
                        dd.httpRequest({
                          url: that.data.domain+'/dingtalk.php?opt=register&code='+authRes.authCode,
                          method: 'GET',
                          data: {},
                          dataType: 'json',
                          timeout:5000,
                          success: function(registerRes) {
                            //console.log(registerRes)
                            if(registerRes.data.code == 200){
                              dd.setStorage({
                                key: 'registerd',
                                data: 1
                              });
                            }
                            
                          },
                          fail:(fail) => { console.log(fail) },
                        });
                      },
                      fail:function(err){}
                    });
                  }
                },
                fail: function(res){
                  dd.alert({content: res.errorMessage});
                }
              });
            },
            fail: function(res) {
              //console.log(res)
            }
          });
        },
        fail:function(err){console.log(err)}
    });
  },

  onShow(){
      /*dd.getAuthCode({
          success:function(res){
            //dd.alert({content: res.authCode});
          },
          fail:function(err){

          }
      })*/
  },

  //打开“添加服务器”对话框
  showAddServerModal(){
    this.setData({"showAddServerModal":true})
  },

  //关闭“添加服务器”对话框
  closeAddServerModal(){
    this.setData({"showAddServerModal":false})
  },

  //添加服务器时选择服务器类型动作
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
    });
  },

  //执行添加服务器操作
  doAddServer(e){
    let that = this
    let api = this.data.domain   //页面不销毁 则可以从data中取
    let postData = e.detail.value
    //校验表单
    let checkFormResult = this.checkForm(postData,1)
    //console.log(checkFormResult)
    if(checkFormResult['code'] != 200){
      dd.showToast({
        content: checkFormResult['msg'],
        type: 'fail',
        duration: 1500
      });
      return
    }
    dd.getAuthCode({
        success:function(res){
          let code = res.authCode
          dd.httpRequest({
            url: api+'/dingtalk.php?opt=addServer&code='+code,
            method: 'POST',
            data: {
              'server_ip':checkFormResult['data']['server-ip'],
              'server_desc':checkFormResult['data']['server-desc'],
              'server_port':checkFormResult['data']['server-port'],
              'server_pwd':checkFormResult['data']['server-pwd'],
              //'server_type':postData['server-type'],
            },
            dataType: 'json',
            timeout:2000,
            success: function(res) {
              let type = (res.data.code == 200) ? 'success' : 'fail'
              dd.showToast({
                'type':type,
                'content':res.data.msg,
                'duration':2000
              })
              that.closeAddServerModal()
            },
            fail: function(res) {
              //console.log(res)
            },
            complete: function(res) {
              //console.log(res)
            }
          });
        },
        fail:function(err){

        }
    });
  },

  /**
   * 表单数据校验
   * @param {*} postData 
   * @param {*} type 1 添加服务器表单 2 添加SSH用户表单
   */
  checkForm(postData,type){
    let checkPostData = {'code':200,'msg':'ok','data':null}
    if(type == 1){
      if(postData['server-ip'] == null || postData['server-ip'].trim() == ""){
        checkPostData['code'] = 199
        checkPostData['msg'] = 'IP 不能为空'
        return checkPostData
      }
      if(postData['server-pwd'] == null || postData['server-pwd'].trim() == ""){
        checkPostData['code'] = 198
        checkPostData['msg'] = 'Root 密码不能为空'
        return checkPostData
      }
      if(postData['server-port'] == null || postData['server-port'].trim() == ""){
        postData['server-port'] = 22
        checkPostData['data'] = postData
      }

    } else if(type == 2){
      for(let key in postData){
        if(postData[key] == null || postData[key].trim() == ""){
          checkPostData['code'] = 199
          checkPostData['msg'] = '参数不能为空'
          return checkPostData
        }
        if(postData['authorization-pwd'] !== postData['authorization-repwd']){
          checkPostData['code'] = 198
          checkPostData['msg'] = '密码不一致'
          return checkPostData
        }
        checkPostData['data'] = postData
      }
    }
    return checkPostData
  },

  //执行添加域名操作
  // addDomain(e){
  //   let that = this
  //   let api = e.detail.value.domain

  //   //获取小程序免登code
  //   dd.getAuthCode({
  //       success:function(res){
  //         //console.log(res) 662e6b09e81633ca9784795a270a2728
  //         let code = res.authCode
  //         //测试域名是否部署了服务
  //         dd.httpRequest({
  //           url: api+'/dingtalk.php?opt=test&code='+code,
  //           method: 'GET',
  //           dataType: 'json',
  //           timeout:2000,
  //           success: function(res) {
  //             dd.setStorage({
  //               key: 'hubDomain',
  //               data:domain,
  //               success: function() {
  //                 that.setData({'show':false})
  //                 dd.alert({content: '添加成功'});
  //               },
  //               fail: function(res){
  //                 dd.alert({content: res.errorMessage});
  //               }
  //             });
  //           },
  //           fail: function(res) {
  //             console.log(res)
  //           },
  //           complete: function(res) {
  //             console.log(res)
  //           }
  //         });
  //       },
  //       fail:function(err){

  //       }
  //   });

  // },

  //对实时输入的 url 作检测 看是否是合法的域名
  // checkDomain(e){
  //   let domain = e.detail.value
  //   if(this.Utils.validDomain(domain)){
  //     this.setData({"validDomain":true})
  //   } else {
  //     this.setData({"validDomain":false})
  //   }
  // },

  //显示所有 ssh用户
  showAuthUsers(e){
      //this.setData({"showAuthUser":true})
      let api = this.data.domain   //页面不销毁 则可以从data中取
      let index = e.target.dataset.index
      this.setData({'curOptServerIndex':index})
      let that = this
      dd.getAuthCode({
        success:function(res){
          let code = res.authCode
          dd.httpRequest({
            url: api+'/dingtalk.php?opt=getAuthorizationUsers&code='+code,
            method: 'POST',
            data:{'index':index},
            dataType: 'json',
            timeout:2000,
            success: function(res) {
              let authUsers = res.data.data
              //console.log(authUsers)
              let newAuthUsers = []
              authUsers.forEach(v => {
                newAuthUsers.push(v['truename']+' '+v['username'])
              });
              //console.log(newAuthUsers)
              dd.showActionSheet({
                items: newAuthUsers,
                title: '服务器上所有SSH用户 —— 点击复制',
                cancelButtonText: '关闭',
                success: (res) => {
                  //console.log(res)
                  let index = res.index
                  dd.setClipboard({
                    text: 'SSH登录用户名:'+authUsers[index]['username']+'\r\nSSH登录密码:'+authUsers[index]['userpwd'],
                    success: () => {
                      dd.showToast({
                        content: '复制成功',
                        type: 'success',
                        duration: 1000
                      });
                    },
                    fail: () => {},
                    complete: () => {},
                  });
                },
                fail: () => {},
                complete: () => {},
              });
            },
            fail: function(res) {
              //console.log(res)
            },
            complete: function(res) {
              //console.log(res)
            }
          });
        },
        fail:function(err){

        }
      });
  },
  
  //关闭授权员工面板
  hiddenAuthUsers(e){
      this.setData({"showAuthUser":false})
  },

  //显示添加授权员工面板
  showAddAuthUser(e){
    //console.log(e.target.dataset)
    //清空表单数据
    let index = e.target.dataset.index
    this.setData({'curOptServerIndex':index,'addAuthUser':true,'authorizationUserData':{}})
  },

  //隐藏添加授权员工面板
  hideAddAuthUser(e){
    this.setData({"addAuthUser":false})
  },

  //选择授权员工
  chooseEmployee(e){
    let that = this
    dd.complexChoose({
        title:"测试标题",            //标题
        multiple:true,            //是否多选
        limitTips:"超出了",          //超过限定人数返回提示
        maxUsers:1000,            //最大可选人数
        pickedUsers:[],            //已选用户
        pickedDepartments:[],          //已选部门
        disabledUsers:[],            //不可选用户
        disabledDepartments:[],        //不可选部门
        requiredUsers:[],            //必选用户（不可取消选中状态）
        requiredDepartments:[],        //必选部门（不可取消选中状态）
        permissionType:"xxx",          //可添加权限校验，选人权限，目前只有GLOBAL这个参数
        responseUserOnly:false,        //返回人，或者返回人和部门
        success:function(res){
            if(res.users.length == 0){
              dd.showToast({
                type: 'fail',
                content: '暂不支持部门选择',
                duration: 2000
              });
            } else if(res.users.length > 1) {
              dd.showToast({
                type: 'fail',
                content: '暂不支持多员工选择',
                duration: 2000
              });
            } else {
              let authorizationUserData = {}
              authorizationUserData['employee_name'] = res.users[0]['name']
              authorizationUserData['authorization_name'] = 'dd-'+res.users[0]['userId']
              authorizationUserData['authorization_pwd'] = 'dd-'+res.users[0]['userId']
              authorizationUserData['authorization_repwd'] = 'dd-'+res.users[0]['userId']
              that.setData({'authorizationUserData':authorizationUserData})
            }
        },
        fail:function(err){
        }
    })
  },


  //执行添加授权员工操作
  doAddAuthUser(e){
    let that = this
    let api = this.data.domain   //页面不销毁 则可以从data中取
    let index = this.data.curOptServerIndex
    let postData = e.detail.value
    //this.setData({'curOptServerIndex':index})
    //console.log(index)
    //校验表单
    let checkFormResult = this.checkForm(postData,2)
    //console.log(checkFormResult)
    if(checkFormResult['code'] != 200){
      dd.showToast({
        content: checkFormResult['msg'],
        type: 'fail',
        duration: 1500
      });
      return
    }
    dd.getAuthCode({
      success:function(res){
        let code = res.authCode
        dd.httpRequest({
          url: api+'/dingtalk.php?opt=addAuthorizationUser&code='+code,
          method: 'POST',
          data:{
            'index':index,
            'authTrueName':checkFormResult['data']['authorization-truename'],
            'authUserName':checkFormResult['data']['authorization-username'],
            'authPwd':checkFormResult['data']['authorization-pwd'],
            'authRepwd':checkFormResult['data']['authorization-repwd']
          },
          dataType: 'json',
          timeout:2000,
          success: function(res) {
            
            if(res.data.code == 200){
              //关闭添加 SSH 用户窗口
              that.hideAddAuthUser()
              dd.alert({
                title: '',
                content: '服务器添加SSH用户成功',
                buttonText: '复制信息',
                success: () => {
                  dd.setClipboard({
                    text: 'SSH登录用户名:'+postData['authorization-username']+'\r\nSSH登录密码:'+postData['authorization-pwd'],
                    success: () => {
                      dd.showToast({
                        content: '复制成功',
                        type: 'success',
                        duration: 1500
                      });
                    },
                    fail: () => {},
                    complete: () => {},
                  });
                },
                fail: () => {},
                complete: () => {},
              });

              // dd.confirm({
              //   title: ' 服务器添加SSH用户成功',
              //   content: '是否复制信息?',
              //   confirmButtonText: '复制并分享',
              //   cancelButtonText: '关闭',
              //   success({ confirm }) {
              //     //console.log(`用户点击了 ${confirm ? '「确定」' : '「取消」'}`);
              //     if(confirm == true){

              //     }
              //   },
              //   fail(fail) {
              //     console.log(fail);
              //   },
              //   complete() {
              //     console.log('complete');
              //   },
              // });
            } else {
              dd.alert({'content':res.data.msg})
            }
          },
          fail: function(res) {
            console.log(res)
          },
          complete: function(res) {
            //console.log(res)
          }
        });
      },
      fail:function(err){

      }
    });
  }
});