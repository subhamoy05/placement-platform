import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    college: "",
    branch: "",
    graduationYear: "",
    skills: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(
          "/users/profile"
        );

        const user =
          response.data.data.user;

        setProfile(user);

        setForm({
          name: user.name || "",
          college: user.college || "",
          branch: user.branch || "",
          graduationYear:
            user.graduationYear || "",
          skills: Array.isArray(user.skills)
            ? user.skills.join(", ")
            : "",
        });
      } catch (err) {
        console.error(
          "Profile error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setSuccess("");
    setError("");
    setEditing(true);
  };

  const handleCancel = () => {
    if (!profile) return;

    setForm({
      name: profile.name || "",
      college: profile.college || "",
      branch: profile.branch || "",
      graduationYear:
        profile.graduationYear || "",
      skills: Array.isArray(profile.skills)
        ? profile.skills.join(", ")
        : "",
    });

    setError("");
    setSuccess("");
    setEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const skills = form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await api.put(
        "/users/profile",
        {
          name: form.name,
          college: form.college,
          branch: form.branch,
          graduationYear:
            form.graduationYear,
          skills,
        }
      );

      const updatedUser =
        response.data.data.user;

      setProfile(updatedUser);

      setForm({
        name: updatedUser.name || "",
        college:
          updatedUser.college || "",
        branch:
          updatedUser.branch || "",
        graduationYear:
          updatedUser.graduationYear || "",
        skills: Array.isArray(
          updatedUser.skills
        )
          ? updatedUser.skills.join(", ")
          : "",
      });

      setEditing(false);
      setSuccess(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Update profile error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <h1>Profile</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-page">
        <h1>Profile</h1>

        <div className="empty-state">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <h1>Profile</h1>

        <div className="empty-state">
          <p>
            Profile information not found.
          </p>
        </div>
      </div>
    );
  }

  const skills = Array.isArray(
    profile.skills
  )
    ? profile.skills
    : [];

  const firstLetter = (
    profile.name || "S"
  )
    .charAt(0)
    .toUpperCase();

  return (
    <div className="profile-page">

      {/* Header */}

      <div className="profile-header">

        <div className="profile-avatar">
          {firstLetter}
        </div>

        <div className="profile-header-info">
          <h1>
            {profile.name || "Student"}
          </h1>

          <p>
            {profile.email ||
              "No email available"}
          </p>
        </div>

        {!editing && (
          <button
            className="profile-edit-button"
            onClick={handleEdit}
          >
            Edit Profile
          </button>
        )}

      </div>

      {/* Messages */}

      {success && (
        <div className="profile-success">
          {success}
        </div>
      )}

      {error && profile && (
        <div className="profile-error">
          {error}
        </div>
      )}

      {editing ? (

        /* =====================
           EDIT FORM
        ===================== */

        <form
          className="profile-edit-card"
          onSubmit={handleSubmit}
        >
          <div className="profile-edit-header">
            <div>
              <h2>Edit Profile</h2>

              <p>
                Update your personal and
                academic information.
              </p>
            </div>
          </div>

          <div className="profile-form-grid">

            <div className="profile-form-group">
              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="profile-form-group">
              <label>
                Email
              </label>

              <input
                type="email"
                value={
                  profile.email || ""
                }
                disabled
              />

              <small>
                Email cannot be changed here.
              </small>
            </div>

            <div className="profile-form-group">
              <label>
                College
              </label>

              <input
                type="text"
                name="college"
                value={form.college}
                onChange={handleChange}
                placeholder="Enter your college"
              />
            </div>

            <div className="profile-form-group">
              <label>
                Branch
              </label>

              <input
                type="text"
                name="branch"
                value={form.branch}
                onChange={handleChange}
                placeholder="e.g. Information Technology"
              />
            </div>

            <div className="profile-form-group">
              <label>
                Graduation Year
              </label>

              <input
                type="number"
                name="graduationYear"
                value={
                  form.graduationYear
                }
                onChange={handleChange}
                placeholder="2027"
              />
            </div>

            <div className="profile-form-group profile-form-full">
              <label>
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="Python, SQL, React, JavaScript"
              />

              <small>
                Separate skills with commas.
              </small>
            </div>

          </div>

          <div className="profile-form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>
        </form>

      ) : (

        /* =====================
           PROFILE VIEW
        ===================== */

        <div className="profile-grid">

          <section className="profile-card">

            <h2>
              Personal Information
            </h2>

            <div className="profile-field">
              <span>Full Name</span>

              <strong>
                {profile.name ||
                  "Not provided"}
              </strong>
            </div>

            <div className="profile-field">
              <span>Email</span>

              <strong>
                {profile.email ||
                  "Not provided"}
              </strong>
            </div>

            <div className="profile-field">
              <span>College</span>

              <strong>
                {profile.college ||
                  "Not provided"}
              </strong>
            </div>

            <div className="profile-field">
              <span>Branch</span>

              <strong>
                {profile.branch ||
                  "Not provided"}
              </strong>
            </div>

            <div className="profile-field">
              <span>
                Graduation Year
              </span>

              <strong>
                {profile.graduationYear ||
                  "Not provided"}
              </strong>
            </div>

          </section>

          <section className="profile-card">

            <h2>Skills</h2>

            {skills.length === 0 ? (
              <p className="profile-muted">
                No skills added yet.
              </p>
            ) : (
              <div className="skills-list">
                {skills.map(
                  (skill, index) => (
                    <span
                      className="skill-tag"
                      key={index}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            )}

          </section>

        </div>
      )}

    </div>
  );
}

export default Profile;