
function SelectPicker() {
  this.init()
}

// mixins
$.extend(SelectPicker.prototype, {
  init: function(){
    this.render()
     // 切换显隐
    $(".select-picker-btn").click(function(){
      $(".select-picker-dropdown").toggle()
    })
  },
  render: function() {
    // 渲染盒子中的内容
  }

})