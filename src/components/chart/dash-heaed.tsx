export const DashboardHeader = () => {
  return (
    <div className="mb-8 text-center space-y-4">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl"></div>
        <div className="relative bg-card/80 backdrop-blur-sm px-8 py-6 rounded-2xl border shadow-lg">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Developer Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive overview of coding activities and achievements
          </p>
        </div>
      </div>
    </div>
  )
}
