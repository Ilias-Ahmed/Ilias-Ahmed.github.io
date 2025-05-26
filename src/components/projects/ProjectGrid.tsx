import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, X } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { Project, ProjectFilter } from "./types";
import { useTheme } from "@/contexts/ThemeContext";
import { triggerHapticFeedback } from "@/utils/haptics";

interface ProjectGridProps {
  projects: Project[];
  columns?: 1 | 2 | 3 | 4;
}

const ProjectGrid = ({ projects, columns = 3 }: ProjectGridProps) => {
  const [filter, setFilter] = useState<ProjectFilter>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Get unique categories and technologies
  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category).filter(Boolean));
    return Array.from(cats);
  }, [projects]);

  const technologies = useMemo(() => {
    const techs = new Set(projects.flatMap((p) => p.tags));
    return Array.from(techs);
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        !filter.category || project.category === filter.category;
      const matchesTechnology =
        !filter.technology || project.tags.includes(filter.technology);
      const matchesStatus = !filter.status || project.status === filter.status;

      return (
        matchesSearch && matchesCategory && matchesTechnology && matchesStatus
      );
    });
  }, [projects, searchTerm, filter]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className="space-y-8">
      {/* Search and Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
              borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = accentColors.primary;
              e.target.style.boxShadow = `0 0 0 3px ${accentColors.primary}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isDark
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.2)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Filter Toggle */}
        <motion.button
          onClick={() => {
            setShowFilters(!showFilters);
            triggerHapticFeedback();
          }}
          className="flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200"
          style={{
            backgroundColor: showFilters
              ? `${accentColors.primary}20`
              : isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.05)",
            borderColor: showFilters
              ? accentColors.primary
              : isDark
              ? "rgba(255,255,255,0.2)"
              : "rgba(0,0,0,0.2)",
            color: showFilters ? accentColors.primary : "inherit",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Filter size={16} />
          <span>Filters</span>
          {Object.values(filter).filter(Boolean).length > 0 && (
            <span
              className="w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
              style={{ backgroundColor: accentColors.primary }}
            >
              {Object.values(filter).filter(Boolean).length}
            </span>
          )}
        </motion.button>
      </motion.div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
                borderColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Category
                  </label>
                  <select
                    value={filter.category || ""}
                    onChange={(e) =>
                      setFilter((prev) => ({
                        ...prev,
                        category: e.target.value || undefined,
                      }))
                    }
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:outline-none"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.05)",
                      borderColor: isDark
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.2)",
                    }}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Technology Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Technology
                  </label>
                  <select
                    value={filter.technology || ""}
                    onChange={(e) =>
                      setFilter((prev) => ({
                        ...prev,
                        technology: e.target.value || undefined,
                      }))
                    }
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:outline-none"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.05)",
                      borderColor: isDark
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.2)",
                    }}
                  >
                    <option value="">All Technologies</option>
                    {technologies.map((tech) => (
                      <option key={tech} value={tech}>
                        {tech}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Status
                  </label>
                  <select
                    value={filter.status || ""}
                    onChange={(e) =>
                      setFilter((prev) => ({
                        ...prev,
                        status: e.target.value || undefined,
                      }))
                    }
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:outline-none"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.05)",
                      borderColor: isDark
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.2)",
                    }}
                  >
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {Object.values(filter).filter(Boolean).length > 0 && (
                <motion.button
                  onClick={() => {
                    setFilter({});
                    triggerHapticFeedback();
                  }}
                  className="mt-4 flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-all duration-200"
                  style={{
                    backgroundColor: `${accentColors.primary}20`,
                    color: accentColors.primary,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={14} />
                  Clear Filters
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <p className="opacity-70">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>

        {searchTerm && (
          <motion.button
            onClick={() => {
              setSearchTerm("");
              triggerHapticFeedback();
            }}
            className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-all duration-200"
            style={{
              backgroundColor: `${accentColors.primary}20`,
              color: accentColors.primary,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={14} />
            Clear Search
          </motion.button>
        )}
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        className={`grid ${gridCols[columns]} gap-8`}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="h-[450px]"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={project} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* No Results */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: `${accentColors.primary}20` }}
          >
            <Search size={24} style={{ color: accentColors.primary }} />
          </div>
          <h3 className="text-xl font-semibold mb-2">No projects found</h3>
          <p className="opacity-70 mb-4">
            Try adjusting your search terms or filters
          </p>
          <motion.button
            onClick={() => {
              setSearchTerm("");
              setFilter({});
              triggerHapticFeedback();
            }}
            className="px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: accentColors.primary,
              color: "white",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset Filters
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectGrid;

