/**
 * @namespace The 'Mask' tool and associated methods.
 */
Tool.Mask = {
	/**
	 * The tool mode can be 'drawing' when the user is in the process of adding 
	 * points to the polygon, or 'inactive' when a polygon has not yet begun.
	 */
	mode: 'draw', //'draw','inactive','drag'
	/**
	 * The polygon currently being drawn. 
	 */
	current_poly: null,
	drag: function() {
	},
	activate: function() {
		Tool.hide_tooltip()
		Tool.add_toolbar("tool_specific")
		Tool.add_tool_specific_button("mask_lock",Tool.Mask.mask_lock,"Lock this image with its mask","/images/silk-grey/lock.png","first silk")
	},
	deactivate: function() {
		Tool.remove_toolbar("tool_specific")
	},

	mousedown: function() {
		if (Tool.Mask.mode == 'inactive') {
		} else if (Tool.Mask.mode == 'draw') {
			if (Warper.active_image && Warper.active_image.mask == false) Tool.Mask.mask_warpable()
			var over_point = false
			Tool.Mask.warpable.mask.points.each(function(point){
				if (point.mouse_inside()) over_point = true
			})
			if (!over_point) { // if you didn't click on an existing node
				Tool.Mask.warpable.mask.new_point(Map.pointer_x(), Map.pointer_y())
			}
		} else if (Tool.Mask.mode == 'drag'){
			Tool.Mask.warpable.mask.enabled=true
		}
		
	}.bindAsEventListener(Tool.Mask),

	mouseup: function() {
	}.bindAsEventListener(Tool.Mask),
	mousemove: function() {
	}.bindAsEventListener(Tool.Mask),

	dblclick: function() {
		// close the poly, fire up the mask
		Tool.Mask.warpable.mask.enabled = true
		Tool.Mask.mode = 'inactive'
		Tool.change('Pan')
	}.bindAsEventListener(Tool.Mask),

	// Mask the currently selected image
	mask_warpable: function() {
		Tool.Mask.warpable = Warper.active_image
		Tool.Mask.mode='draw'
		Tool.Mask.warpable.mask = new Tool.Mask.Shape([],Tool.Mask.warpable)	
	},

	Shape: Class.create({
		initialize: function(nodes,parent_image) {
			this.enabled = false
			this.points = []//$A(
			this.dragging=false
			this.color='#222'
			this.parent_image = parent_image		
	
			Glop.observe('glop:postdraw', this.draw.bindAsEventListener(this))
			Glop.observe('mousedown', this.mousedown.bindAsEventListener(this))
			Glop.observe('mouseup', this.mouseup.bindAsEventListener(this))
		},
		/**
		 * A function to generate an array of coordinate pairs as in [lat,lon] for the mask points
		 */
		coordinates: function() {
			coordinates = []
			this.points.each(function(point) {
				var lon = Projection.x_to_lon(-point.x)
				var lat = Projection.y_to_lat(point.y)
				coordinates.push([lon,lat])
			})
			return coordinates
		},
		new_point: function(x,y) {
			this.points.push(new Tool.Mask.ControlPoint(x, y, 6, this))
		},
		mouse_inside: function(){
			//if (Geome6try.is_point_in_poly(this.points, Map.pointer_x(), Map.pointer_y())){
			//	console.log('Mouse in point')
			//}
			return Geometry.is_point_in_poly(this.points, Map.pointer_x(), Map.pointer_y())
		},
		base: function(){
			this.color="#222"
			this.dragging=false
		},
		mousedown: function() {
			if (Geometry.is_point_in_poly(this.points, Map.pointer_x(), Map.pointer_y())&&Tool.active !='Mask') {
				this.active = true
				this.color='#f00'
				console.log('Clicked shape')
				this.points.each(function(point) {
					point.old_x = point.x
					point.old_y = point.y
				})
				this.first_click_x=Map.pointer_x()
				this.first_click_y=Map.pointer_y()
				if (this.active){
					if (!this.dragging){
						this.dragging = true
						Tool.change('Warp')
					}
				}
			} 
			else if (Tool.active != 'Mask') {
				this.active = false
				this.color='#000'
			}
		},
		mouseup: function() {
			this.dragging = false
		},
		hover: function(){
			this.color='#900'
			this.dragging=false
		},	
		draw: function() {
			if (this.mouse_inside()){
				if (this.dragging){
					this.drag_started=true
					Tool.Mask.mode='drag'
					for (var i=0; i<this.points.length; i++){
						this.points[i].x=this.points[i].old_x + (Map.pointer_x()-this.first_click_x)
						this.points[i].y=this.points[i].old_y + (Map.pointer_y()-this.first_click_y)
					}
					this.color = '#f00'
				}
				else if (!Mouse.down){
					this.hover()
				}
			}
			if (this.drag_started && Mouse.down){
				for (var i=0; i<this.points.length; i++){
					this.points[i].x=this.points[i].old_x + (Map.pointer_x()-this.first_click_x)
					this.points[i].y=this.points[i].old_y + (Map.pointer_y()-this.first_click_y)
				}
				this.color = '#f00'
			}
			if (!Mouse.down){
				this.drag_started=false
			}
			else{
				this.base()
			}
			
				$C.save()
				$C.stroke_style('#000')
				$C.fill_style(this.color)
				if (this.active) $C.line_width(2/Map.zoom)
				else $C.line_width(0)
				$C.begin_path()
				if (this.points.length > 0) {
					$C.move_to(this.points[0].x, this.points[0].y)		
					this.points.each(function(point) {
						$C.line_to(point.x, point.y)
					})			
					$C.line_to(this.points[0].x, this.points[0].y)
				}
				$C.opacity(0.4)
				$C.stroke()
				$C.opacity(0.2)
				$C.fill()
				$C.restore()
		}
	}),
	ControlPoint: Class.create({
		initialize: function(x,y,r,parent_shape) {
			this.x = x
			this.y = y
			this.r = r 
			this.parent_shape = parent_shape
			this.color = '#200'
			this.dragging = false
			Glop.observe('glop:postdraw', this.draw.bindAsEventListener(this))
			Glop.observe('mousedown', this.click.bindAsEventListener(this))
		},
		draw: function() {
			if (this.parent_shape.parent_image.active) {
				$C.save()
					$C.line_width(3/Map.zoom)
					// go to the object's location:
					$C.translate(this.x,this.y)
					// draw the object:
					$C.fill_style("#333")
					$C.opacity(0.6)
					if (this.parent_shape.locked) {
						$C.begin_path()
						$C.move_to(-6/Map.zoom,-6/Map.zoom)
						$C.line_to(6/Map.zoom,6/Map.zoom)
						$C.move_to(-6/Map.zoom,6/Map.zoom)
						$C.line_to(6/Map.zoom,-6/Map.zoom)
						$C.stroke()
					} else {
						if (this.mouse_inside()) $C.circ(0, 0, this.r/Map.zoom) 
						$C.stroke_circ(0, 0, this.r/Map.zoom)
					}
				$C.restore()
			}
			
			/*var nodestring = ''
			nodes.each(function(node) {
				nodestring += '(' + node[0] + ', ' + node[1] + ')\n'
			})*/
			
			if (this.dragging && Mouse.down) {
				//Tool.change('Warp')
				this.drag()
			} else if (this.mouse_inside()) {
				if (Mouse.down) {
					this.drag()
				} else {
					this.hover()
				}
			} else {
				this.base()
			}
		},
		mouse_inside: function() {
			return (Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r)
		},
		base: function() {
			// do stuff
			this.color = '#200'
			this.dragging = false
		},
		click: function() {
			if (Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r  && Tool.active!='Mask') {
				this.color = '#f00'
				console.log('clicked control point')
				this.parent_shape.active = true

			}
		},
		hover: function() {
			// do stuff
			this.color = '#900'
			this.dragging = false
		},
		drag: function() {
			if (!this.dragging) {
				this.dragging = true
				this.drag_offset_x = Map.pointer_x() - this.x
				this.drag_offset_y = Map.pointer_y() - this.y
			}
			if (this.drag_offset_x) {
				this.x = Map.pointer_x() - this.drag_offset_x
				this.y = Map.pointer_y() - this.drag_offset_y
			}
		},
		r: function() {
			this.color = '#00f'
		}
	}),
}
