
function SelectPicker(opts) {
  this.elem =  opts.elem || '#selectPicker'
  this.datas =  opts.datas || []
  this.init()
}

// mixins
$.extend(SelectPicker.prototype, {

  selectedOptions: [],

  init: function(){
    // 初始化结构
    this.render()

    this._bindEvent()
     
  },
  render: function() {
    // 渲染结构
    this.renderStructure()
    this.renderSelectElement()
    // 渲染选项
    this.renderOptions()

  },

  renderStructure: function(options){
    // 渲染盒子中的内容
    var htmlText = 
                    '<select name="select" class="select-picker-selector" multiple="multiple">'+
                      '<!-- 所有选择 -->'+
                    '</select>'+

                    '<button class="select-picker-btn"><span>请选择</span><i class="iconfont">&#xe600;</i></button>'+
                    '<!-- 下拉 -->'+
                    '<div class="select-picker-dropdown" style="display:none;">'+
                      '<div class="select-picker-dropdown-top">'+
                        '<div class="select-picker-dropdown-search">'+
                          '<input type="text">'+
                          '<i class="iconfont">&#xe67f;</i>'+
                        '</div>'+
                        '<div class="select-picker-dropdown-btn-group">'+
                          '<div class="select-picker-dropdown-btn" name="all">选中所有</div>'+
                          '<div class="select-picker-dropdown-btn" name="cancel">取消选中</div>'+
                        '</div>'+
                      '</div>'+
                      '<div class="select-picker-dropdown-seletor">'+
                        '<!-- 挂载选项 -->'+
                      '</div>'+
                      '<div>'+
                        '<div class="select-picker-dropdown-btn-close">关闭</div>'+
                      '</div>'+
                    '</div>'
    $(this.elem).append(htmlText)
  },

  renderSelectElement: function(){
    // 挂载目标
    var realTarget = $(this.elem + ' .select-picker-selector')
    this.datas.forEach(function(item){
      var selectHtml = '<option value="'+ item +'">' + item + '</option>'
      realTarget.append(selectHtml)
    })
  },

  renderOptions: function(options){
    var that = this 
    var target = $(this.elem + ' .select-picker-dropdown-seletor')

    // 清空
    target.empty()

    // 首次渲染
    if(!options){
     options = this.datas.slice(0)
    }

    options.forEach(function(item, index){
      var optionHtml = '<div class="select-picker-dropdown-option" value="' + item + '" data-checked="false">'+ item + '</div>'
      var optionTarget = $(optionHtml)

      for (var i = 0; i < that.selectedOptions.length; i++) {
        var selected = that.selectedOptions[i]
        if(selected === item) {
          // 初始化状态
          optionTarget.attr("data-checked", true)
          that._selectorSelect(true, selected)
          optionTarget.append('<i class="iconfont">&#xe60c;</i>')
          break;
        }
      }

      target.append(optionTarget)
    })
  },


  // 绑定事件
  _bindEvent: function() {
    var that = this
    var btnflag = false;

    // 切换显隐
    $(that.elem + " .select-picker-btn").click(function(){
      $(that.elem + " .select-picker-dropdown").fadeToggle(100)
    })
    // 关闭事件
    $(that.elem + " .select-picker-dropdown-btn-close").click(function(){
      $(that.elem + " .select-picker-dropdown").hide()
    })


    // 全选/取消全选事件
    $(this.elem + ' .select-picker-dropdown-btn[name]').click(function(){
      btnflag = true
      var choose = $(this).attr('name')
      if( choose=== 'all'){
        $(that.elem + ' .select-picker-dropdown-seletor').children("[data-checked='false']").click()
      } else if(choose === 'cancel'){
        $(that.elem + ' .select-picker-dropdown-seletor').children("[data-checked='true']").click()
      }
      // 执行完毕后更新值，避免多次触发change
      that._refreshShowValue()
      btnflag = false
    })

    // 绑定选项"切换选中"事件
    $(that.elem + ' .select-picker-dropdown-seletor').children().click(function(){
      var val = $(this).attr("data-checked") == 'false' ? false : true;
      $(this).attr("data-checked", !val)
      that._selectorSelect(!val, $(this).attr("value"));
      if(val) {
        $(this).children('i.iconfont').remove()
      } else{
        $(this).append('<i class="iconfont">&#xe60c;</i>')
      } 

      // 单击时触发，通过组合按钮触发click时，不更新，直到所有选中后再更新
      if(!btnflag){
        that._refreshShowValue()
      }
      
    })

    $(that.elem + ' select-picker-dropdown-search i').click(function(){
      $(that.elem + ' .select-picker-dropdown-search input').change()
    })

    // Filter
    $(that.elem + ' .select-picker-dropdown-search input').change(function(){
      var filterOptions = [];

      var keyword = $(this).val()
      if(keyword === '') {
        that.renderOptions()
      }

      var options = that.datas.slice(0)
      var searchexp = new RegExp(keyword, i)
      for (var i = 0; i < options.length; i++) {
        if(options[i].search(searchexp) > -1){
          // 匹配到字符
          filterOptions.push(options[i])
        }
      }
      that.renderOptions(filterOptions)
      that._releaseEvent()
      that._bindEvent()
    })

    
  },

  _releaseEvent: function(){
    var that = this
    $(that.elem + " .select-picker-btn").unbind('click')
    $(that.elem + " .select-picker-dropdown-btn-close").unbind('click')
    $(that.elem + ' .select-picker-dropdown-btn[name]').unbind('click')
    $(that.elem + ' .select-picker-dropdown-seletor').children().unbind('click')
    $(that.elem + ' .select-picker-dropdown-search input').unbind('change')
  },


  _selectorSelect: function(selected, value){
    var target = $(this.elem + ' .select-picker-selector').children('[value='+ value+ ']')
    if(selected){
      target.attr("selected", true)
    } else {
      target.removeAttr("selected")
    }
  },


  _refreshShowValue: function(){
    var target = $(this.elem + ' .select-picker-selector').children('option[selected]')
    var showTarget = $(this.elem +' .select-picker-btn span')
    var names = []
    target.each(function(){
      names.push($(this).val())
    })
    var showText = names.join(", ")
    if(showText == "") {
      showText = "请选择"
    }
    showTarget.text(showText)

    // 触发改变事件
    showTarget.trigger('change')

    // 存储选中结果
    this.selectedOptions = names.slice(0)
  },


  // Event
  onChange: function(callback){
    var that = this
    var target = $(this.elem +' .select-picker-btn span')
    target.on('change', function(){
      callback(that.getValue())
    })
  },

  // 外部获取值
  getValue: function(){
    var target = $(this.elem + ' .select-picker-selector').children('option[selected]')
    var vals = []
    target.each(function(){
      vals.push($(this).val())
    })
    return vals
  }

})