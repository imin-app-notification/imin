import React from 'react'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'

export default class Calendar extends React.Component {
    render() {
        return (
            <div key={this.props.events}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: null,
                        right: 'title'//'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    titleFormat={{ year: 'numeric', month: 'short', day: 'numeric' }}
                    initialView='dayGridMonth'
                    editable={false}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    contentHeight='auto'
                    initialEvents={this.props.events} // alternatively, use the `events` setting to fetch from a feed
                // select={this.handleDateSelect}
                // custom render function
                // eventClick={this.handleEventClick}
                // eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
                /* you can update a remote database when these fire:
                eventAdd={function(){}}
                eventChange={function(){}}
                eventRemove={function(){}}
                */
                />
            </div>
        )
    }
}