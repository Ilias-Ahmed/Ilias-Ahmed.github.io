import { useRef, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Filter, Search, X } from "lucide-react";
import ProjectGrid from "@/components/projects/ProjectGrid";
import { projectsData } from "@/components/projects/projectsData";
import ProjectShowcase from "@/components/projects/ProjectShowcase";
import ProjectStats from "@/components/projects/ProjectStats";
import ProjectTimeline from "@/components/projects/ProjectTimeline";
import ProjectViewToggle from "@/components/projects/ProjectViewToggle";
import { ViewMode, ProjectFilter, Project } from "@/components/projects/types";
import { useTheme } from "@/contexts/ThemeContext";

const ProjectsSection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [viewMode, setViewMode] = useState<ViewMode>("showcase");
  const [globalFilter, setGlobalFilter] = useState<ProjectFilter>({});
  const [searchTerm, setSearchTerm] = useState("");
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Ensure projectsData is properly typed and exists
  const safeProjectsData: Project[] = useMemo(() => {
    if (!projectsData || !Array.isArray(projectsData)) {
      return [];
    }
    return projectsData.filter(
      (project): project is Project =>
        project !== null &&
        project !== undefined &&
        typeof project === "object" &&
        "id" in project &&
        "title" in project &&
        "description" in project
    );
  }, []);

  // Filter projects based on global filters and search
  const filteredProjects = useMemo(() => {
    return safeProjectsData.filter((project) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          (project.tags &&
            project.tags.some((tag) =>
              tag.toLowerCase().includes(searchLower)
            )) ||
          (project.category &&
            project.category.toLowerCase().includes(searchLower));

        if (!matchesSearch) return false;
      }

      // Category filter
      if (globalFilter.category && project.category !== globalFilter.category) {
        return false;
      }

      // Status filter
      if (globalFilter.status && project.status !== globalFilter.status) {
        return false;
      }

      // Year filter
      if (globalFilter.year && project.year !== globalFilter.year) {
        return false;
      }

      // Technology filter
      if (globalFilter.technology && project.tags) {
        const hasTechnology = project.tags.some((tag) =>
          tag.toLowerCase().includes(globalFilter.technology!.toLowerCase())
        );
        if (!hasTechnology) return false;
      }

      return true;
    });
  }, [safeProjectsData, searchTerm, globalFilter]);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = Array.from(
      new Set(
        safeProjectsData
          .map((p) => p.category)
          .filter((category): category is string => Boolean(category))
      )
    );

    const statuses = Array.from(
      new Set(
        safeProjectsData
          .map((p) => p.status)
          .filter(
            (status): status is NonNullable<Project["status"]> =>
              status !== undefined && status !== null
          )
      )
    );

    const years = Array.from(
      new Set(
        safeProjectsData
          .map((p) => p.year)
          .filter((year): year is string => Boolean(year))
      )
    )
      .sort()
      .reverse();

    const technologies = Array.from(
      new Set(
        safeProjectsData
          .flatMap((p) => p.tags || [])
          .filter((tag): tag is string => Boolean(tag))
      )
    ).sort();

    return { categories, statuses, years, technologies };
  }, [safeProjectsData]);

  const clearAllFilters = () => {
    setGlobalFilter({});
    setSearchTerm("");
  };

  const removeFilter = (filterKey: keyof ProjectFilter) => {
    setGlobalFilter((prev) => {
      const newFilter = { ...prev };
      delete newFilter[filterKey];
      return newFilter;
    });
  };

  const activeFilterEntries = Object.entries(globalFilter).filter(([, value]) =>
    Boolean(value)
  );
  const hasActiveFilters =
    activeFilterEntries.length > 0 || searchTerm.length > 0;

  const formatStatusDisplay = (status: string): string => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <section
      className="py-16 md:py-32 px-6 relative overflow-hidden"
      id="projects"
      ref={ref}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: accentColors.primary }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ backgroundColor: accentColors.secondary }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6 text-primary mr-3 animate-pulse" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-blue-500">
              Featured Projects
            </h2>
            <Sparkles className="w-6 h-6 text-primary ml-3 animate-pulse" />
          </div>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Explore my portfolio of projects that showcase my passion for
            creating beautiful, functional, and user-centered digital
            experiences across various domains.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50"
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.8)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              <select
                value={globalFilter.category || ""}
                onChange={(e) =>
                  setGlobalFilter((prev) => ({
                    ...prev,
                    category: e.target.value || undefined,
                  }))
                }
                className="px-4 py-2 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.8)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
              >
                <option value="">All Categories</option>
                {filterOptions.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={globalFilter.year || ""}
                onChange={(e) =>
                  setGlobalFilter((prev) => ({
                    ...prev,
                    year: e.target.value || undefined,
                  }))
                }
                className="px-4 py-2 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.8)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
              >
                <option value="">All Years</option>
                {filterOptions.years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={globalFilter.status || ""}
                onChange={(e) =>
                  setGlobalFilter((prev) => ({
                    ...prev,
                    status: e.target.value || undefined,
                  }))
                }
                className="px-4 py-2 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.8)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
              >
                <option value="">All Status</option>
                {filterOptions.statuses.map((status) => (
                  <option key={status} value={status}>
                    {formatStatusDisplay(status)}
                  </option>
                ))}
              </select>

              <select
                value={globalFilter.technology || ""}
                onChange={(e) =>
                  setGlobalFilter((prev) => ({
                    ...prev,
                    technology: e.target.value || undefined,
                  }))
                }
                className="px-4 py-2 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.8)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
              >
                <option value="">All Technologies</option>
                {filterOptions.technologies.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <motion.button
                  onClick={clearAllFilters}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-80 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: `${accentColors.primary}20`,
                    color: accentColors.primary,
                    border: `1px solid ${accentColors.primary}40`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Filters
                </motion.button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {activeFilterEntries.map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                  style={{
                    backgroundColor: `${accentColors.primary}20`,
                    color: accentColors.primary,
                    border: `1px solid ${accentColors.primary}30`,
                  }}
                >
                  {key === "status"
                    ? formatStatusDisplay(value)
                    : `${key}: ${value}`}
                  <button
                    onClick={() => removeFilter(key as keyof ProjectFilter)}
                    className="hover:opacity-70 focus:outline-none"
                    aria-label={`Remove ${key} filter`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              {searchTerm && (
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                  style={{
                    backgroundColor: `${accentColors.primary}20`,
                    color: accentColors.primary,
                    border: `1px solid ${accentColors.primary}30`,
                  }}
                >
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:opacity-70 focus:outline-none"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
            </motion.div>
          )}

          {/* Results Count */}
          <div className="text-sm opacity-70 mb-4">
            Showing {filteredProjects.length} of {safeProjectsData.length}{" "}
            projects
          </div>
        </motion.div>

        {/* View Toggle */}
        <ProjectViewToggle activeView={viewMode} onChange={setViewMode} />

        {/* Project Views */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {viewMode === "showcase" && (
            <ProjectShowcase
              projects={
                filteredProjects.length > 0
                  ? filteredProjects
                  : safeProjectsData.slice(0, 5)
              }
            />
          )}
          {viewMode === "grid" && <ProjectGrid projects={filteredProjects} />}
          {viewMode === "timeline" && (
            <ProjectTimeline projects={filteredProjects} />
          )}
        </motion.div>

        {/* No Results Message */}
        {filteredProjects.length === 0 && hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: `${accentColors.primary}20` }}
            >
              <Filter size={32} style={{ color: accentColors.primary }} />
            </div>
            <h3 className="text-2xl font-semibold mb-4">No projects found</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              No projects match your current search criteria. Try adjusting your
              filters or search terms.
            </p>
            <motion.button
              onClick={clearAllFilters}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: accentColors.primary,
                color: "white",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear All Filters
            </motion.button>
          </motion.div>
        )}

        {/* Project Stats */}
        <ProjectStats />
      </div>
    </section>
  );
};

export default ProjectsSection;
