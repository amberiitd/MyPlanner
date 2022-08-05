export const projectTemplate: any = {
    label: 'Project Template',
    value: 'project-template',
    children: [
        {
            label: "Software development",
            value: "software-development",
            description: 'Plan, track and release great software. Get up and running quickly with templates that suit the way your team works. Plus, integrations for DevOps teams that want to connect work across their entire toolchain.',
            children: [
                {
                    label: 'Kanban',
                    value: 'kandan',
                    children: [],
                    caption: 'Visualize and advance your project forward using issues on a powerful board.',
                    leftBsIcon: '1-square'
                },
                {
                    label: 'Scrum',
                    value: 'scrum',
                    children: [],
                    leftBsIcon: '2-square'
                }
            ]

        },
        {
            label: "Service management",
            value: "service-management",
            children: [
                {
                    label: 'IT Service Management',
                    value: 'it-service-management',
                    children: []
                }
            ]
            
        },
        {
            label: "Work management",
            value: "work-management",
            
        }
    ]
}